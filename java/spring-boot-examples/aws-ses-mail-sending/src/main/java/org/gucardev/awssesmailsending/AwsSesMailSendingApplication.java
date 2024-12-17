package org.gucardev.awssesmailsending;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class AwsSesMailSendingApplication {

	public static void main(String[] args) {
		SpringApplication.run(AwsSesMailSendingApplication.class, args);
	}

}
