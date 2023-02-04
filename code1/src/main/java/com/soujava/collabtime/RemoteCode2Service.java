package com.soujava.collabtime;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

@RegisterRestClient
public interface RemoteCode2Service {
    @GET
    @Path("/hello")
    String hello();
}
