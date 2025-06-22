package com.soujava.collabtime.code4;

import io.pyroscope.http.Format;
import io.pyroscope.javaagent.EventType;
import io.pyroscope.javaagent.PyroscopeAgent;
import io.pyroscope.javaagent.config.Config;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Code4Application {

	public static void main(String[] args) {
		PyroscopeAgent.start(
				new Config.Builder()
						.setApplicationName("code4")
						.setProfilingEvent(EventType.ITIMER)
						.setFormat(Format.JFR)
						.setServerAddress("http://localhost:32040")
						.build()
		);

		SpringApplication.run(Code4Application.class, args);
	}

}
