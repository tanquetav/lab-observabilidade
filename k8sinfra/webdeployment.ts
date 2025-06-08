import { Construct } from "constructs"
import * as kubernetes from "@cdktf/provider-kubernetes"

export class WebDeployment extends Construct {
  public readonly resource: kubernetes.deployment.Deployment

  constructor(
    scope: Construct,
    name: string,
    image:string,
    replicas: number,
  ) {
    super(scope, name)

    this.resource = new kubernetes.deployment.Deployment(this, name, {
      metadata: {
        labels: {
          app:name,
        },
        name: `${name}`,
      },
      spec: {
        replicas: replicas.toString(),
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
                image: image,
                name: `${name}`,
              },
            ],
          },
        },
      },
    })
  }
}

export default WebDeployment;