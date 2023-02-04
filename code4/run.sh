java -javaagent:elastic-apm-agent.jar -Delastic.apm.service_name=code4 \
     -Delastic.apm.application_packages=com.soujava.collabtime -Delastic.apm.secret_token=1234 \
     -Delastic.apm.trace_methods=com.soujava.collabtime.code4.WaitService \
     -Delastic.apm.server_url=http://140.84.165.132:8200 -jar target/code4-0.0.1-SNAPSHOT.jar
