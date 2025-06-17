import { Construct } from "constructs";
import * as kubernetes from "@cdktf/provider-kubernetes";
import { NAMESPACE2 } from "./constants";
import { GF_GRAFANA } from "./files/grafana/data";

export class Grafana extends Construct {
  public readonly resource: kubernetes.deployment.Deployment;
  public readonly service: kubernetes.service.Service;

  constructor(scope: Construct) {
    super(scope, "grafana");
    const name = "grafana";
    const cm = new kubernetes.configMap.ConfigMap(this, "graffiles", {
      metadata: {
        namespace: NAMESPACE2,
        name: "graffiles",
      },
      data: {
        "grafana-datasources.yaml": GF_GRAFANA,
      },
    });

    this.resource = new kubernetes.deployment.Deployment(this, "grafana", {
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
                  name: "graffiles",
                  items: [
                    {
                      key: "grafana-datasources.yaml",
                      path: "grafana-datasources.yaml",
                    },
                  ],
                },
              },
            ],
            container: [
              {
                image: "grafana/grafana:12.0.1",
                name: `${name}`,
                volumeMount: [
                  {
                    name: "cm",
                    subPath: "grafana-datasources.yaml",
                    mountPath:
                      "/etc/grafana/provisioning/datasources/datasources.yaml",
                  },
                ],
                env: [
                  {
                    name: "GF_AUTH_ANONYMOUS_ENABLED",
                    value: "true",
                  },
                  {
                    name: "GF_AUTH_ANONYMOUS_ORG_ROLE",
                    value: "Admin",
                  },
                  {
                    name: "GF_AUTH_DISABLE_LOGIN_FORM",
                    value: "true",
                  },
                ],
              },
            ],
          },
        },
      },
    });
    this.service = new kubernetes.service.Service(this, "grafana-svc", {
      metadata: {
        namespace: NAMESPACE2,
        name: "grafanaservice",
      },
      spec: {
        type: "NodePort",
        port: [
          {
            port: 3000,
            targetPort: "3000",
            nodePort: 32001,
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

export default Grafana;
