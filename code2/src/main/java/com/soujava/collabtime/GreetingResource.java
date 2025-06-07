package com.soujava.collabtime;

import io.quarkus.logging.Log;
import org.jboss.logging.Logger;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/hello")
public class GreetingResource {
    private static final Logger LOG = Logger.getLogger(GreetingResource.class);
    @Inject
    WaitService waitService;
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        Log.info("Starting Hello2");
        waitService.waitTime();
        return "Hello from RESTEasy Reactive";
    }
}