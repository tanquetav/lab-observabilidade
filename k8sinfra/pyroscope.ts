import { Construct } from "constructs";
import * as kubernetes from "@cdktf/provider-kubernetes";
import { NAMESPACE2 } from "./constants";

export class Pyroscope extends Construct {
  public readonly resource: kubernetes.deployment.Deployment;
  public readonly service: kubernetes.service.Service;

  constructor(scope: Construct) {
    super(scope, "pyroscope");
    const name = "pyroscope";
    // const cm = new kubernetes.configMap.ConfigMap(this, "pyroscopefiles", {
    //   metadata: {
    //     namespace: NAMESPACE2,
    //     name: "pyroscopefiles",
    //   },
    //   data: {
    //     "pyroscope.yaml": TP_pyroscope,
    //   },
    // });

    this.resource = new kubernetes.deployment.Deployment(this, "pyroscope", {
      // dependsOn: [cm],
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
            // volume: [
            //   {
            //     name: "cm",
            //     configMap: {
            //       name: "pyroscopefiles",
            //       items: [
            //         {
            //           key: "pyroscope.yaml",
            //           path: "pyroscope.yaml",
            //         },
            //       ],
            //     },
            //   },
            // ],
            container: [
              {
                image: "grafana/pyroscope:1.13.4",
                name: `${name}`,
                // volumeMount: [
                //   {
                //     name: "cm",
                //     subPath: "pyroscope.yaml",
                //     mountPath: "/etc/pyroscope.yaml",
                //   },
                // ],
                // args: ["-config.file=/etc/pyroscope.yaml"],
              },
            ],
          },
        },
      },
    });
    this.service = new kubernetes.service.Service(this, "pyroscope-svc", {
      metadata: {
        namespace: NAMESPACE2,
        name: "pyroscopeservice",
      },
      spec: {
        type: "NodePort",
        port: [
          // {
          //   name: "grpc",
          //   port: 4318,
          //   targetPort: "4318",
          //   nodePort: 32318,
          //   protocol: "TCP",
          // },
          {
            name: "pyroscope",
            port: 4040,
            targetPort: "4040",
            nodePort: 32040,
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

export default Pyroscope;
