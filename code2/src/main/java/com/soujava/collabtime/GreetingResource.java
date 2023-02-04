package com.soujava.collabtime;

import io.quarkus.logging.Log;
import org.jboss.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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