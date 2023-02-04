data "oci_core_images" "master" {
  compartment_id           = oci_identity_compartment.compartment.id
  shape                    = var.shape
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "20.04"
}


resource "oci_core_instance" "master" {

  display_name        = "master"
  availability_domain = data.oci_identity_availability_domains.oci.availability_domains[0].name
  compartment_id      = oci_identity_compartment.compartment.id
  shape               = var.shape
  shape_config {
    memory_in_gbs = var.memory_in_gbs_per_node
    ocpus         = var.ocpus_per_node
  }
  source_details {
    source_id   = data.oci_core_images.master.images[0].id
    source_type = "image"
  }
  create_vnic_details {
    subnet_id  = oci_core_subnet.sn.id
    private_ip = format("10.0.0.%d", 10)
  }
  metadata = {
    ssh_authorized_keys = join("\n", local.authorized_keys)
    user_data           = data.cloudinit_config.cloudinit.rendered
  }

  provisioner "file" {
    source      = "files/master.sh"
    destination = "/tmp/master.sh"
  }

  provisioner "file" {
    content     = tls_self_signed_cert.example.cert_pem
    destination = "/tmp/kibana-server.crt"
  }

  provisioner "file" {
    content     = tls_private_key.example.private_key_pem
    destination = "/tmp/kibana-server.key"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/master.sh",
      "sudo /tmp/master.sh",

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

data "remote_file" "node_token" {
  depends_on = [
    oci_core_instance.master,
  ]

  conn {
    host        = coalesce(oci_core_instance.master.public_ip, oci_core_instance.master.private_ip)
    agent       = true
    user        = "ubuntu"
    private_key = tls_private_key.ssh.private_key_pem
  }

  path = "/home/ubuntu/node_token"
}

data "remote_file" "elastic_password" {
  depends_on = [
    oci_core_instance.master,
  ]

  conn {
    host        = coalesce(oci_core_instance.master.public_ip, oci_core_instance.master.private_ip)
    agent       = true
    user        = "ubuntu"
    private_key = tls_private_key.ssh.private_key_pem
  }

  path = "/home/ubuntu/elastic_password"
}


