output "public_ip" {
  value       = oci_core_instance.master.public_ip
  description = "public ip"
}

output "public_ip_worker" {
  value       = oci_core_instance.worker[*].public_ip
  description = "worker public ip"
}

output "elastic_password" {
  value       = data.remote_file.elastic_password.content
  description = "Elastic Password"
  sensitive   = true
}
