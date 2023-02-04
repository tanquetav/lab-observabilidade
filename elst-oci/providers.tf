terraform {
  required_providers {
    oci = {
      source  = "hashicorp/oci"
      version = "4.105.0"
    }
    remote = {
      source  = "tenstad/remote"
      version = "0.0.23"
    }
  }
}

provider "remote" {
  # Configuration options
  max_sessions = 1
}
