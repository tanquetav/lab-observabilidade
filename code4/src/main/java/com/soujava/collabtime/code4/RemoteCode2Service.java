package com.soujava.collabtime.code4;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RemoteCode2Service {
    public String hello() {
        RestTemplate restTemplate = new RestTemplate();
        String fooResourceUrl
                = "http://localhost:8082/hello";
        ResponseEntity<String> response
                = restTemplate.getForEntity(fooResourceUrl , String.class);
        return response.getBody();
    }
}
