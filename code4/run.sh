java -javaagent:./elastic-otel-javaagent.jar \
-Dotel.exporter.otlp.endpoint=http://localhost:4318 \
-Dotel.service.name=code4 \
-jar target/code4-0.0.1-SNAPSHOT.jar

