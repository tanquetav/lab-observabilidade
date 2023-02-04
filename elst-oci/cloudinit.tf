locals {
  packages = [
    "apt-transport-https",
    "build-essential",
    "ca-certificates",
    "curl",
    "jq",
    "lsb-release",
    "make",
    "prometheus-node-exporter",
    "python3-pip",
    "software-properties-common",
    "tmux",
    "tree",
    "unzip",
    "elasticsearch",
    "kibana",
    "elastic-agent",
  ]
}
data "http" "apt_repo_key" {
  url = "https://artifacts.elastic.co/GPG-KEY-elasticsearch"
}


data "cloudinit_config" "cloudinit" {
  #for_each = local.nodes

  part {
    filename     = "cloud-config.cfg"
    content_type = "text/cloud-config"
    content      = <<-EOF
      package_update: true
      package_upgrade: false
      packages:
      ${yamlencode(local.packages)}
      apt:
        sources:
          elastic.list:
            source: "deb https://artifacts.elastic.co/packages/8.x/apt stable main"
            key: |
              ${indent(8, data.http.apt_repo_key.body)}
      runcmd:
        - [ systemctl, daemon-reload ]
      users:
      - default
      write_files:
      - path: /home/ubuntu/.ssh/id_rsa
        defer: true
        owner: "ubuntu:ubuntu"
        permissions: "0600"
        content: |
          ${indent(4, tls_private_key.ssh.private_key_pem)}
      - path: /home/ubuntu/.ssh/id_rsa.pub
        defer: true
        owner: "ubuntu:ubuntu"
        permissions: "0600"
        content: |
          ${indent(4, tls_private_key.ssh.public_key_openssh)}
      EOF
  }

}
