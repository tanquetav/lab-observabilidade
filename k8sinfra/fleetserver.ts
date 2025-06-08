import { Construct } from "constructs";
import * as kubernetes from "@cdktf/provider-kubernetes";
import { NAMESPACE } from "./constants";
import {
  FS_CA_PEM,
  FS_CERTIFICATE_PEM,
  FS_KEY_PEM,
} from "./files/fleetserver/data";
import { VERSION2 } from "./files/elasticsearch/data";

export class FleetServer extends Construct {
  public readonly resource: kubernetes.deployment.Deployment;
  public readonly service: kubernetes.service.Service;

  constructor(scope: Construct) {
    super(scope, "fleetserver");
    const name = "fleetserver";
    const cm = new kubernetes.configMap.ConfigMap(this, "ftfiles", {
      metadata: {
        namespace: NAMESPACE,
        name: "ftfiles",
      },
      data: {
        "ca.pem": FS_CA_PEM,
        "certificate.pem": FS_CERTIFICATE_PEM,
        "key.pem": FS_KEY_PEM,
      },
    });

    this.resource = new kubernetes.deployment.Deployment(this, "fleetserver", {
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
                  name: "ftfiles",
                  items: [
                    {
                      key: "certificate.pem",
                      path: "certificate.pem",
                    },
                    {
                      key: "key.pem",
                      path: "key.pem",
                    },
                  ],
                },
              },
            ],
            container: [
              {
                image: `docker.elastic.co/elastic-agent/elastic-agent:${VERSION2}`,
                name: `${name}`,
                // volumeMount: [
                //   {
                //     name: "cm",
                //     subPath: "certificate.pem",
                //     mountPath: "/etc/pki/tls/certs/fleet-server.pem",
                //   },
                //   {
                //     name: "cm",
                //     subPath: "key.pem",
                //     mountPath: "/etc/pki/tls/private/fleet-server-key.pem",
                //   },
                // ],
                env: [
                  { name: "FLEET_SERVER_ENABLE", value: "1" },
                  { name: "FLEET_SERVER_POLICY_ID", value: "fleet-server-apm" },
                  {
                    name: "FLEET_SERVER_ELASTICSEARCH_HOST",
                    value: "http://elasticsearchservice:9200",
                  },
                  {
                    name: "FLEET_SERVER_ELASTICSEARCH_USERNAME",
                    value: "admin",
                  },
                  {
                    name: "FLEET_SERVER_ELASTICSEARCH_PASSWORD",
                    value: "changeme",
                  },
                  // {
                  //   name: "FLEET_SERVER_CERT",
                  //   value: "/etc/pki/tls/certs/fleet-server.pem",
                  // },
                  // {
                  //   name: "FLEET_SERVER_CERT_KEY",
                  //   value: "/etc/pki/tls/private/fleet-server-key.pem",
                  // },
                  {
                    name: "FLEET_URL",
                    value: "https://localhost:8220",
                  },
                  { name: "KIBANA_FLEET_SETUP", value: "true" },
                  {
                    name: "KIBANA_FLEET_HOST",
                    value: "http://kibanaservice:5601",
                  },
                  { name: "KIBANA_FLEET_USERNAME", value: "admin" },
                  { name: "KIBANA_FLEET_PASSWORD", value: "changeme" },
                ],
              },
            ],
          },
        },
      },
    });
    this.service = new kubernetes.service.Service(this, "fleetserver-svc", {
      metadata: {
        namespace: NAMESPACE,
        name: "fleetserverservice",
      },
      spec: {
        type: "NodePort",
        port: [
          {
            name: "p1",
            port: 8220,
            targetPort: "8220",
            nodePort: 32220,
            protocol: "TCP",
          },
          {
            name: "p2",
            port: 8200,
            targetPort: "8200",
            nodePort: 31200,
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

export default FleetServer;
