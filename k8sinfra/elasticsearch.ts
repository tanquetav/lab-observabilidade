import { Construct } from "constructs";
import * as kubernetes from "@cdktf/provider-kubernetes";
import { NAMESPACE } from "./constants";
import {
  ES_ROLES,
  ES_USERS,
  ES_USERS_ROLES,
  VERSION,
} from "./files/elasticsearch/data";

export class ElasticSearch extends Construct {
  public readonly resource: kubernetes.deployment.Deployment;
  public readonly service: kubernetes.service.Service;

  constructor(scope: Construct) {
    super(scope, "elasticsearch");
    const name = "elasticsearch";
    const cm = new kubernetes.configMap.ConfigMap(this, "elstfiles", {
      metadata: {
        namespace: NAMESPACE,
        name: "elstfiles",
      },
      data: {
        "roles.yml": ES_ROLES,
        users: ES_USERS,
        users_roles: ES_USERS_ROLES,
      },
    });

    this.resource = new kubernetes.deployment.Deployment(
      this,
      "elasticsearch",
      {
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
                    name: "elstfiles",
                    items: [
                      {
                        key: "roles.yml",
                        path: "roles.yml",
                      },
                      {
                        key: "users",
                        path: "users",
                      },
                      {
                        key: "users_roles",
                        path: "users_roles",
                      },
                    ],
                  },
                },
              ],
              container: [
                {
                  image: `docker.elastic.co/elasticsearch/elasticsearch:${VERSION}-amd64`,
                  name: `${name}`,
                  volumeMount: [
                    {
                      name: "cm",
                      subPath: "roles.yml",
                      mountPath: "/usr/share/elasticsearch/config/roles.yml",
                    },
                    {
                      name: "cm",
                      subPath: "users",
                      mountPath: "/usr/share/elasticsearch/config/users",
                    },
                    {
                      name: "cm",
                      subPath: "users_roles",
                      mountPath: "/usr/share/elasticsearch/config/users_roles",
                    },
                  ],
                  env: [
                    {
                      name: "ES_JAVA_OPTS",
                      value: "-Xms1g -Xmx1g",
                    },
                    { name: "network.host", value: "0.0.0.0" },
                    { name: "transport.host", value: "127.0.0.1" },
                    { name: "http.host", value: "0.0.0.0" },
                    {
                      name: "cluster.routing.allocation.disk.threshold_enabled",
                      value: "false",
                    },
                    { name: "discovery.type", value: "single-node" },
                    {
                      name: "xpack.security.authc.anonymous.roles",
                      value: "remote_monitoring_collector",
                    },
                    {
                      name: "xpack.security.authc.realms.file.file1.order",
                      value: "0",
                    },
                    {
                      name: "xpack.security.authc.realms.native.native1.order",
                      value: "1",
                    },
                    { name: "xpack.security.enabled", value: "true" },
                    {
                      name: "xpack.license.self_generated.type",
                      value: "trial",
                    },
                    {
                      name: "xpack.security.authc.token.enabled",
                      value: "true",
                    },
                    {
                      name: "xpack.security.authc.api_key.enabled",
                      value: "true",
                    },
                    {
                      name: "logger.org.elasticsearch",
                      value: "info",
                    },
                    {
                      name: "action.destructive_requires_name",
                      value: "false",
                    },
                  ],
                },
              ],
            },
          },
        },
      }
    );
    this.service = new kubernetes.service.Service(this, "elasticsearch-svc", {
      metadata: {
        namespace: NAMESPACE,
        name: "elasticsearchservice",
      },
      spec: {
        type: "NodePort",
        port: [
          {
            port: 9200,
            targetPort: "9200",
            nodePort: 32200,
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

export default ElasticSearch;
