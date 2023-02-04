package com.soujava.collabtime;

import io.quarkus.logging.Log;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
        Log.info("Starting Hello1");
        waitService.waitTime();
        remoteCode2Service.hello();
        return "Hello from RESTEasy Reactive";
    }
}