package com.soujava.collabtime;

import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import io.quarkus.logging.Log;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class WaitService {
    @WithSpan("waiting")
    public void waitTime() {
        Log.info("Start Waiting1");
        try {
            long millis = (long) (1000 * Math.random());
            Span.current().addEvent("cachemiss", Attributes.builder().put("cachewait", millis).build());
            Thread.sleep(millis);
        } catch (InterruptedException e) {
        }
        Log.info("Finish Waiting1");
    }
}
