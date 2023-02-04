# Elasticsearch/Kibana deployment to OCI

This terraform demo project creates an environment at AWS with a Elasticsearch Cluster (you can define how many worker nodes will be deployed beside the master one).

On local machine is created an ssh keypair (to connect to ec2 instances), a self-signed certificate (used in kibana). The first AWS resource deployed is a VPC (with VPC companion, like routing table, subnet, security group ) to create an isolated network to elasticsearch deployment with ssh(22)/kibana(5601) external access.

The master node (ec2master.tf) is deployed with ubuntu image (2020.04) using a cloudinit to bootstrap package installation (elasticsearch and kibana). After the ec2 deployment, a master.sh setup the master node configuring and starting elasticsearch and kibana. After all, a file with elastic password is created for further output and a file with node join token to enable the worker nodes to be deployed.

The worker nodes (ec2worker.tf) are deployed using the same image and cloudinit bootstrap (kibana will not be started) and the script worker.sh join each worker node to cluster.

All AWS resource are created with the same tag to track the resource easier.

Terraform output is the ip to each machine and elastic password. The elastic password is a sensitive data and you can use this command to show the output in json format:

```bash
terraform show -json | jq | less
```

The kibana can be accessed using https://_public_ip_:5601 , user _elastic_ and password from previous command

## Requirements

| Name                                                                     | Version  |
| ------------------------------------------------------------------------ | -------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 1.0.0 |

## Providers

| Name                                                                              | Version |
| --------------------------------------------------------------------------------- | ------- |
| <a name="provider_oci"></a> [oci](#provider_oci)                                  | 4.57.0  |
| <a name="provider_tenstad_remote"></a> [tenstad_remote](#provider_tenstad_remote) | 0.0.23  |

## Inputs

| Name                                                                                                | Description            | Type     | Default             | Required |
| --------------------------------------------------------------------------------------------------- | ---------------------- | -------- | ------------------- | :------: |
| <a name="input_name"></a> [name](#input_name)                                                       | Tag name for resources | `string` | demo                |   yes    |
| <a name="input_worker_nodes"></a> [worker_nodes](#input_worker_nodes)                               | Now many worker nodes  | `number` | 2                   |   yes    |
| <a name="input_shape"></a> [shape](#input_shape)                                                    | Instance Shape         | `string` | VM.Standard.A1.Flex |   yes    |
| <a name="input_ocpus_per_node"></a> [ocpus_per_node](#input_ocpus_per_node)                         | Ocpus per node         | `number` | 1                   |   yes    |
| <a name="input_memory_in_gbs_per_node"></a> [memory_in_gbs_per_node](#input_memory_in_gbs_per_node) | Memory per node        | `number` | 3                   |   yes    |

## Outputs

| Name                                                                                       | Description                       |
| ------------------------------------------------------------------------------------------ | --------------------------------- |
| <a name="output_public_ip"></a> [public_ip](#output_public_ip)                             | Master public ip                  |
| <a name="output_public_ip_worker"></a> [public_ip_worker](#output_public_ip_worker)        | Worker public ip                  |
| <a name="output_elastic_password"></a> [public_elastic_password](#output_elastic_password) | elastic user password (sensitive) |



--fleet-server-es-insecure
