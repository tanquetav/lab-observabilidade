import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import * as kubernetes from "@cdktf/provider-kubernetes";
//import WebDeployment from "./webdeployment";
import { Namespace } from "@cdktf/provider-kubernetes/lib/namespace";
import { NAMESPACE, NAMESPACE2 } from "./constants";
import ElasticSearch from "./elasticsearch";
import Kibana from "./kibana";
import FleetServer from "./fleetserver";
import Prometheus from "./prometheus";
import Loki from "./loki";
import Tempo from "./tempo";
import Grafana from "./grafana";
import Pyroscope from "./pyroscope";
// import Prometheus from "./prometheus";
// import Loki from "./loki";
// import Tempo from "./tempo";
// import Grafana from "./grafana";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new kubernetes.provider.KubernetesProvider(this, "k8s", {
      configPath: "/home/george/.kube/config",
      //configPath: "/home/george/software/ampernetacle/infra/kubeconfig",
    });

    new Namespace(this, "namespace", {
      metadata: {
        name: NAMESPACE,
      },
    });

    new Namespace(this, "namespace2", {
      metadata: {
        name: NAMESPACE2,
      },
    });
    new ElasticSearch(this);
    new Kibana(this);
    new FleetServer(this);
    new Prometheus(this);
    new Loki(this);
    new Tempo(this);
    new Pyroscope(this);
    new Grafana(this);

    //new WebDeployment(this, "nginx", "nginx", 1);

    // define resources here
  }
}

const app = new App();
new MyStack(app, "k8sinfra");
app.synth();
