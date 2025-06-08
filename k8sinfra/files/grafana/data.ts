export const GF_GRAFANA = `apiVersion: 1

datasources:
- name: Prometheus
  type: prometheus
  uid: prometheus
  access: proxy
  orgId: 1
  url: http://prometheusservice:9090
  basicAuth: false
  isDefault: false
  version: 1
  editable: false
  jsonData:
    httpMethod: GET
- name: Tempo
  type: tempo
  access: proxy
  orgId: 1
  url: http://temposervice:3200
  basicAuth: false
  isDefault: true
  version: 1
  editable: false
  apiVersion: 1
  uid: tempo
  jsonData:
    httpMethod: GET
    serviceMap:
      datasourceUid: prometheus
- name: Loki
  type: loki
  access: proxy
  orgId: 1
  url: http://lokiservice:3100
  basicAuth: false
  isDefault: false
  version: 1
  editable: false
  apiVersion: 1
  jsonData:
    derivedFields:
      - datasourceUid: tempo
        matcherRegex: (?:traceID|trace_id)=(\w+)
        name: TraceID
        url: \$\${__value.raw}`;

