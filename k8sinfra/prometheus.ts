import { Construct } from "constructs";
import * as kubernetes from "@cdktf/provider-kubernetes";
import { NAMESPACE2 } from "./constants";
import { PROM_PROMETHEUS2 } from "./files/prometheus/data";

export class Prometheus extends Construct {
  public readonly resource: kubernetes.deployment.Deployment;
  public readonly service: kubernetes.service.Service;

  constructor(scope: Construct) {
    super(scope, "prometheus");
    const name = "prometheus";
    const cm = new kubernetes.configMap.ConfigMap(this, "promfiles", {
      metadata: {
        namespace: NAMESPACE2,
        name: "promfiles",
      },
      data: {
        "prometheus.yaml": PROM_PROMETHEUS2,
      },
    });

    this.resource = new kubernetes.deployment.Deployment(this, "prometheus", {
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
                  name: "promfiles",
                  items: [
                    {
                      key: "prometheus.yaml",
                      path: "prometheus.yaml",
                    },
                  ],
                },
              },
            ],
            container: [
              {
                image: "prom/prometheus:v3.4.1",
                name: `${name}`,
                volumeMount: [
                  {
                    name: "cm",
                    subPath: "prometheus.yaml",
                    mountPath: "/etc/prometheus.yaml",
                  },
                ],
                args: [
                  "--config.file=/etc/prometheus.yaml",
                  "--web.enable-remote-write-receiver",
                  "--enable-feature=exemplar-storage",
                  "--web.enable-otlp-receiver",
                ],
              },
            ],
          },
        },
      },
    });
    this.service = new kubernetes.service.Service(this, "prometheus-svc", {
      metadata: {
        namespace: NAMESPACE2,
        name: "prometheusservice",
      },
      spec: {
        type: "NodePort",
        port: [
          {
            name: "p1",
            port: 9090,
            targetPort: "9090",
            nodePort: 32090,
            protocol: "TCP",
          },
          {
            name: "p2",
            port: 8888,
            targetPort: "8888",
            nodePort: 31888,
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

export default Prometheus;
