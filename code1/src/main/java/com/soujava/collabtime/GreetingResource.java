package com.soujava.collabtime;

import io.opentelemetry.api.baggage.Baggage;
import io.quarkus.logging.Log;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/")
public class GreetingResource {
    private static final Logger LOG = Logger.getLogger(GreetingResource.class);

    @Inject
    WaitService waitService;

    @Inject
    @RestClient
    RemoteCode2Service remoteCode2Service;
    @GET
    @Path("/hello")
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        Log.info("Starting Hello1");
        waitService.waitTime();
        return "Hello from RESTEasy Reactive";
    }

    @GET
    @Path("/error")
    @Produces(MediaType.TEXT_PLAIN)
    public String error() {
        Log.info("Starting Error1");
        waitService.waitTime();
        throw new RuntimeException("Error1");
        // return "Error from RESTEasy Reactive";
    }

    @GET
    @Path("/remote")
    @Produces(MediaType.TEXT_PLAIN)
    public String remote() {
        var baggage = Baggage.current()
        .toBuilder()
        .put("user", "123")
        .build();

        try (var baggageCurrent = baggage.makeCurrent()){
            Log.info("Starting Hello1");
            waitService.waitTime();
            remoteCode2Service.hello();
            return "Hello from RESTEasy Reactive";
        }
    }
}