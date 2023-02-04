package com.soujava.collabtime.code4;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {
    @Autowired
    WaitService waitService;

    @Autowired
    RemoteCode2Service remoteCode2Service;
    @GetMapping("/hello")
    public String hello() {
        waitService.waitTime();
        return "Hello from spring";
    }


    @GetMapping("/remote")
    public String remote() {
        waitService.waitTime();
        remoteCode2Service.hello();
        return "Hello from spring";
    }
}
