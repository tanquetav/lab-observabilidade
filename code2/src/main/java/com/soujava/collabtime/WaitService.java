package com.soujava.collabtime;

import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import io.quarkus.logging.Log;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import javax.sql.DataSource;
import java.sql.SQLException;

@ApplicationScoped
public class WaitService {

    @Inject
    DataSource dataSource;
    @WithSpan("waiting")
    public void waitTime() {
        Log.info("Start Waiting2");
        double sleepTime = Math.random();
        Span.current().addEvent("cachemiss", Attributes.builder().put("cachewait", sleepTime).build());
        try ( var conn = dataSource.getConnection();
              var prep = conn.prepareStatement("SELECT pg_sleep(?)");
        ) {
            prep.setDouble(1, sleepTime);
            prep.execute();
        } catch (SQLException e) {
        }
        Log.info("Finish Waiting2");
    }
}
