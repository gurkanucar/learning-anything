package com.gucardev.debeziumcdc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@EnableKafka
@SpringBootApplication
public class DebeziumCdcApplication {

	public static void main(String[] args) {
		SpringApplication.run(DebeziumCdcApplication.class, args);
	}

}
