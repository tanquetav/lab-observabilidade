import { Construct } from "constructs";
import * as kubernetes from "@cdktf/provider-kubernetes";
import { NAMESPACE2 } from "./constants";
import { TP_TEMPO } from "./files/tempo/data";

export class Tempo extends Construct {
  public readonly resource: kubernetes.deployment.Deployment;
  public readonly service: kubernetes.service.Service;

  constructor(scope: Construct) {
    super(scope, "tempo");
    const name = "tempo";
    const cm = new kubernetes.configMap.ConfigMap(this, "tempofiles", {
      metadata: {
        namespace: NAMESPACE2,
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
        namespace: NAMESPACE2,
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
                image: "grafana/tempo:2.2.0",
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
        namespace: NAMESPACE2,
        name: "temposervice",
      },
      spec: {
        type: "NodePort",
        port: [
          {
            name: "grpc",
            port: 4317,
            targetPort: "4317",
            nodePort: 32317,
            protocol: "TCP",
          },
          {
            name: "tempo",
            port: 3200,
            targetPort: "3200",
            nodePort: 32318,
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
