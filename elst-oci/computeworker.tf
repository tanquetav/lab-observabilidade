data "oci_core_images" "worker" {
  compartment_id           = oci_identity_compartment.compartment.id
  shape                    = var.shape
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "20.04"
}

resource "oci_core_instance" "worker" {
  depends_on = [
    oci_core_instance.master,
  ]

  count = var.worker_nodes

  display_name        = format("worker%d" , count.index)
  availability_domain = data.oci_identity_availability_domains.oci.availability_domains[0].name
  compartment_id      = oci_identity_compartment.compartment.id
  shape               = var.shape
  shape_config {
    memory_in_gbs = var.memory_in_gbs_per_node
    ocpus         = var.ocpus_per_node
  }
  source_details {
    source_id   = data.oci_core_images.worker.images[0].id
    source_type = "image"
  }
  create_vnic_details {
    subnet_id  = oci_core_subnet.sn.id
    private_ip = format("10.0.0.%d", 11 + count.index)
  }
  metadata = {
    ssh_authorized_keys = join("\n", local.authorized_keys)
    user_data           = data.cloudinit_config.cloudinit.rendered
  }


  provisioner "file" {
    source      = "files/worker.sh"
    destination = "/tmp/worker.sh"
  }

  provisioner "file" {
    content     = data.remote_file.node_token.content
    destination = "/tmp/token"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/worker.sh",
      "sudo /tmp/worker.sh ",

    ]
  }
  connection {
    host        = coalesce(self.public_ip, self.private_ip)
    agent       = true
    type        = "ssh"
    user        = "ubuntu"
    private_key = tls_private_key.ssh.private_key_pem
  }

}


