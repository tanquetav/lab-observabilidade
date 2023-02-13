* Verifique a branch grafana para a observabilidade com o stack da grafana

* Elastic

https://www.elastic.co/guide/en/apm/guide/current/open-telemetry.html

https://discuss.elastic.co/t/no-information-in-the-metrics-module-of-the-apm-screen/279346

* Services:

** code1

Quarkus, opentelemetry, metric otlp exporter

- hello: call wait
- error: call wait, throw exception
- remote: call wait, remote call code2 -> hello

** code2

Quarkus, opentelemetry, metric otlp exporter, jdbc addon
- hello: call wait ( request to postgres pg_sleep)

** code4

Spring, elasticapm instrumentation

- hello: call wait
- error: call wait, throw exception
- remote: call wait, remote call code2 -> hello
