#!/bin/bash
cloud-init status --wait

netfilter-persistent stop
netfilter-persistent flush

TOKEN=`cat /tmp/token`

echo Y | /usr/share/elasticsearch/bin/elasticsearch-reconfigure-node  --enrollment-token $TOKEN

systemctl enable elasticsearch
systemctl start elasticsearch