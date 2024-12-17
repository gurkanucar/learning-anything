package org.gucardev.mailsending;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class MailSendingApplication {

	public static void main(String[] args) {
		SpringApplication.run(MailSendingApplication.class, args);
	}

}
