package com.gucardev.debeziumcdc;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DebeziumConsumer {

    @KafkaListener(topics = "pg-changes.public.customer", groupId = "events")
    public void consume(JsonNode message) {
        log.info("Received Debezium event: {}", message.toString());
    }
}
