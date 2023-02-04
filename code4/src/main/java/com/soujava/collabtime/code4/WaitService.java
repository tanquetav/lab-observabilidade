package com.soujava.collabtime.code4;

import org.springframework.stereotype.Service;

@Service
public class WaitService {
    public void waitTime() {
        try {
            Thread.sleep((long) (1000 * Math.random()));
        } catch (InterruptedException e) {
        }
    }
}
