variable "name" {
  default     = "apmdemo"
  description = "The name of the project"
}

variable "worker_nodes" {
  type    = number
  default = 0
  #default = 2
}

variable "shape" {
  type    = string
  default = "VM.Standard3.Flex"
  #default = "VM.Standard.A1.Flex"
}

variable "ocpus_per_node" {
  type    = number
  default = 1
}

variable "memory_in_gbs_per_node" {
  type    = number
  default = 8
}
