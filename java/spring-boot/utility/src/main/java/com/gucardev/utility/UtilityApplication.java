package com.gucardev.utility;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@EnableAspectJAutoProxy(proxyTargetClass = true)
@SpringBootApplication
public class UtilityApplication {

    public static void main(String[] args) {
        SpringApplication.run(UtilityApplication.class, args);
    }

}
