import { Construct } from "constructs";
import * as kubernetes from "@cdktf/provider-kubernetes";
import { NAMESPACE2 } from "./constants";

export class Loki extends Construct {
  public readonly resource: kubernetes.deployment.Deployment;
  public readonly service: kubernetes.service.Service;

  constructor(scope: Construct) {
    super(scope, "loki");
    const name = "loki";

    this.resource = new kubernetes.deployment.Deployment(this, "loki", {
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
            container: [
              {
                image: "grafana/loki:3.4.1",
                name: `${name}`,
                args: ["-config.file=/etc/loki/local-config.yaml"],
              },
            ],
          },
        },
      },
    });
    this.service = new kubernetes.service.Service(this, "loki-svc", {
      metadata: {
        namespace: NAMESPACE2,
        name: "lokiservice",
      },
      spec: {
        type: "NodePort",
        port: [
          {
            port: 3100,
            targetPort: "3100",
            nodePort: 32000,
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

export default Loki;
