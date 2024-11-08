package com.gucardev.rediscachingexample;

import com.gucardev.rediscachingexample.infra.CacheProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({CacheProperties.class})
public class RedisCachingExampleApplication {
    public static void main(String[] args) {
        SpringApplication.run(RedisCachingExampleApplication.class, args);
    }
}
