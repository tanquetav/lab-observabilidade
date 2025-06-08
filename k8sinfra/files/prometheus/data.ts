export const PROM_PROMETHEUS = `global:
  scrape_interval:     15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'code1'
    metrics_path: "/q/metrics"
    static_configs:
      - targets: [ '192.168.5.241:8080' ]
  - job_name: 'code2'
    metrics_path: "/q/metrics"
    static_configs:
      - targets: [ '192.168.5.241:8082' ]
`;

export const PROM_PROMETHEUS2 = `global:
  scrape_interval:     15s
  evaluation_interval: 15s
`;
