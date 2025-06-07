package com.soujava.collabtime;

import io.opentelemetry.instrumentation.annotations.WithSpan;
import io.quarkus.logging.Log;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class WaitService {
    @WithSpan("waiting")
    public void waitTime() {
        Log.info("Start Waiting1");
        try {
            Thread.sleep((long) (1000 * Math.random()));
        } catch (InterruptedException e) {
        }
        Log.info("Finish Waiting1");
    }
}
