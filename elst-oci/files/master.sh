#!/bin/bash

cloud-init status --wait

netfilter-persistent stop
netfilter-persistent flush

echo "network.host: 0.0.0.0" >> /etc/elasticsearch/elasticsearch.yml
systemctl enable elasticsearch
systemctl start elasticsearch

mkdir -p /etc/kibana/certs
cp /tmp/kibana-server.* /etc/kibana/certs
chown -R kibana.kibana /etc/kibana/certs
while [ true ]
do
      KIBANA_TOKEN=`/usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana`
      if [ $? -eq 0 ] 
      then
            break;
      fi
      sleep 2
done 
/usr/share/kibana/bin/kibana-setup -t $KIBANA_TOKEN
echo server.host: "0.0.0.0" >> /etc/kibana/kibana.yml
echo server.ssl.enabled: true >> /etc/kibana/kibana.yml
echo server.ssl.certificate: /etc/kibana/certs/kibana-server.crt >> /etc/kibana/kibana.yml
echo server.ssl.key: /etc/kibana/certs/kibana-server.key >> /etc/kibana/kibana.yml
systemctl enable kibana --now

NODE_TOKEN=`/usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s node`
PASS=`cat /var/log/cloud-init-output.log |grep "elastic built-in superuser is"| awk -F ': ' '{print $2}'`
echo -n $NODE_TOKEN > /home/ubuntu/node_token
echo -n ${PASS::-1} > /home/ubuntu/elastic_password

#cp /var/lib/kibana/ca*.crt /var/lib/apm-server/new.crt
#chown apm-server /var/lib/apm-server/new.crt


