java -javaagent:./elastic-otel-javaagent.jar \
-Dotel.exporter.otlp.endpoint=http://localhost:4318 \
-Dotel.service.name=code4 \
-jar target/code4-0.0.1-SNAPSHOT.jar


#"-Dotel.exporter.otlp.headers=Authorization=Bearer XXXX" \
#java -javaagent:elastic-otel-javaagent.jar -Dotel.service.name=code4 \
#     -Delastic.apm.application_packages=com.soujava.collabtime  \
#     -Delastic.apm.trace_methods=com.soujava.collabtime.code4.WaitService \
#     -Delastic.otel.universal.profiling.integration.enabled=true \
#     -Dotel.exporter.otlp.endpoint=http://localhost:4318  -jar target/code4-0.0.1-SNAPSHOT.jar
