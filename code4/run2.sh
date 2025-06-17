java -javaagent:elastic-apm-agent.jar -Delastic.apm.service_name=code4 \
     -Delastic.apm.log_file=/tmp/agent.log \
     -Delastic.apm.log_level=DEBUG \
     -Delastic.apm.application_packages=com.soujava.collabtime  \
     -Delastic.apm.trace_methods=com.soujava.collabtime.code4.WaitService \
     -Delastic.apm.universal_profiling_integration_enabled=true \
     -Delastic.apm.server_url=http://172.18.0.1:31200  -jar target/code4-0.0.1-SNAPSHOT.jar
