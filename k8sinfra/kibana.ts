import { Construct } from "constructs";
import * as kubernetes from "@cdktf/provider-kubernetes";
import { NAMESPACE } from "./constants";
import { KN_KIBANA } from "./files/kibana/data";
import { VERSION } from "./files/elasticsearch/data";

export class Kibana extends Construct {
  public readonly resource: kubernetes.deployment.Deployment;
  public readonly service: kubernetes.service.Service;

  constructor(scope: Construct) {
    super(scope, "kibana");
    const name = "kibana";
    const cm = new kubernetes.configMap.ConfigMap(this, "kbnfiles", {
      metadata: {
        namespace: NAMESPACE,
        name: "kbnfiles",
      },
      data: {
        "kibana.yml": KN_KIBANA,
      },
    });

    this.resource = new kubernetes.deployment.Deployment(this, "kibana", {
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
                  name: "kbnfiles",
                  items: [
                    {
                      key: "kibana.yml",
                      path: "kibana.yml",
                    },
                  ],
                },
              },
            ],
            container: [
              {
                image: `docker.elastic.co/kibana/kibana:${VERSION}`,
                name: `${name}`,
                volumeMount: [
                  {
                    name: "cm",
                    subPath: "kibana.yml",
                    mountPath: "/usr/share/kibana/config/kibana.yml",
                  },
                ],
                env: [
                  {
                    name: "ELASTICSEARCH_HOSTS",
                    value: '["http://elasticsearchservice:9200"]',
                  },
                  {
                    name: "ELASTICSEARCH_USERNAME",
                    value: "kibana_system_user",
                  },
                  {
                    name: "ELASTICSEARCH_PASSWORD",
                    value: "changeme",
                  },
                  {
                    name: "XPACK_FLEET_AGENTS_FLEET_SERVER_HOSTS",
                    value: '["https://fleetserverservice:8220"]',
                  },
                  {
                    name: "XPACK_FLEET_AGENTS_ELASTICSEARCH_HOSTS",
                    value: '["http://elasticsearchservice:9200"]',
                  },
                ],
              },
            ],
          },
        },
      },
    });
    this.service = new kubernetes.service.Service(this, "kibana-svc", {
      metadata: {
        namespace: NAMESPACE,
        name: "kibanaservice",
      },
      spec: {
        type: "NodePort",
        port: [
          {
            port: 5601,
            targetPort: "5601",
            nodePort: 32601,
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

export default Kibana;
