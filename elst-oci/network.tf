locals {
  cidr_block = "10.0.0.0/16"
}

resource "oci_core_vcn" "vcn" {
  compartment_id = oci_identity_compartment.compartment.id
  cidr_block     = local.cidr_block
}

resource "oci_core_internet_gateway" "ig" {
  compartment_id = oci_identity_compartment.compartment.id
  vcn_id         = oci_core_vcn.vcn.id
}

resource "oci_core_default_route_table" "rt" {
  manage_default_resource_id = oci_core_vcn.vcn.default_route_table_id
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.ig.id
  }
}

resource "oci_core_default_security_list" "sl" {
  manage_default_resource_id = oci_core_vcn.vcn.default_security_list_id
  ingress_security_rules {
    protocol = "6" # tcp
    tcp_options {
      min = 5601
      max = 5601
    }
    source = "0.0.0.0/0"
  }

  ingress_security_rules {
    protocol = "6" # tcp
    tcp_options {
      min = 9200
      max = 9200
    }
    source = "0.0.0.0/0"
  }
  ingress_security_rules {
    protocol = "6" # tcp
    tcp_options {
      min = 8200
      max = 8200
    }
    source = "0.0.0.0/0"
  }
  ingress_security_rules {
    protocol = "6" # tcp
    tcp_options {
      min = 22
      max = 22
    }
    source = "0.0.0.0/0"
  }

  ingress_security_rules {
    protocol = "6" # tcp
    tcp_options {
      min = 9200
      max = 9200
    }
    source = local.cidr_block
  }
  ingress_security_rules {
    protocol = "6" # tcp
    tcp_options {
      min = 9300
      max = 9300
    }
    source = local.cidr_block
  }
  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
  }
}

resource "oci_core_subnet" "sn" {
  compartment_id    = oci_identity_compartment.compartment.id
  cidr_block        = "10.0.0.0/24"
  vcn_id            = oci_core_vcn.vcn.id
  route_table_id    = oci_core_default_route_table.rt.id
  security_list_ids = [oci_core_default_security_list.sl.id]
}
