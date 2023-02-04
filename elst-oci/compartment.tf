resource "oci_identity_compartment" "compartment" {
  name          = var.name
  description   = var.name
  enable_delete = true
}

data "oci_identity_availability_domains" "oci" {
  compartment_id = oci_identity_compartment.compartment.id
}
