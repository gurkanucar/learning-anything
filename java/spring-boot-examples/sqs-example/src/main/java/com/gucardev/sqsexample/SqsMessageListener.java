package com.gucardev.sqsexample;


import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
@Slf4j
@Service
public class SqsMessageListener {

    @SqsListener("https://sqs.us-east-1.amazonaws.com/my-test-queue")
    public void receiveMessage(String message) {
        log.info(message);
    }
}
