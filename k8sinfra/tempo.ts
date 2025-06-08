import { Construct } from "constructs";
import * as kubernetes from "@cdktf/provider-kubernetes";
import { NAMESPACE } from "./constants";
import { TP_TEMPO } from "./files/tempo/data";

export class Tempo extends Construct {
  public readonly resource: kubernetes.deployment.Deployment;
  public readonly service: kubernetes.service.Service;

  constructor(scope: Construct) {
    super(scope, "tempo");
    const name = "tempo";
    const cm = new kubernetes.configMap.ConfigMap(this, "tempofiles", {
      metadata: {
        namespace: NAMESPACE,
        name: "tempofiles",
      },
      data: {
        "tempo.yaml": TP_TEMPO,
      },
    });

    this.resource = new kubernetes.deployment.Deployment(this, "tempo", {
      dependsOn: [cm],
      metadata: {
        labels: {
          app: name,
        },
        namespace: NAMESPACE,
        name: name,
      },
      spec: {
        replicas: "1",
        selector: {
          matchLabels: {
            app: name,
          },
        },
        template: {
          metadata: {
            labels: {
              app: name,
            },
          },
          spec: {
            volume: [
              {
                name: "cm",
                configMap: {
                  name: "tempofiles",
                  items: [
                    {
                      key: "tempo.yaml",
                      path: "tempo.yaml",
                    },
                  ],
                },
              },
            ],
            container: [
              {
                image: "grafana/tempo:latest",
                name: `${name}`,
                volumeMount: [
                  {
                    name: "cm",
                    subPath: "tempo.yaml",
                    mountPath: "/etc/tempo.yaml",
                  },
                ],
                args: ["-config.file=/etc/tempo.yaml"],
              },
            ],
          },
        },
      },
    });
    this.service = new kubernetes.service.Service(this, "tempo-svc", {
      metadata: {
        namespace: NAMESPACE,
        name: "tempoervice",
      },
      spec: {
        type: "NodePort",
        port: [
          {
            port: 24317,
            targetPort: "24317",
            nodePort: 32317,
            protocol: "TCP",
          },
        ],
        selector: {
          app: name,
        },
      },
    });
  }
}

export default Tempo;

