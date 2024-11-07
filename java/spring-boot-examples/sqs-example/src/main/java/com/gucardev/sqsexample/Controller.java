package com.gucardev.sqsexample;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping
@RequiredArgsConstructor
public class Controller {

    private final EventBridgeService eventBridgeService;

    @PostMapping("/do-something")
    void doSomething(@RequestBody Payload payload) {
        eventBridgeService.createOneTimeSchedule(payload);
    }

}
