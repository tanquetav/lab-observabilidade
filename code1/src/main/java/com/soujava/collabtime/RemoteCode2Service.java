package com.soujava.collabtime;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@RegisterRestClient
public interface RemoteCode2Service {
    @GET
    @Path("/hello")
    String hello();
}
