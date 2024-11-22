package com.gucardev.utility;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Slf4j
@EnableAspectJAutoProxy(proxyTargetClass = true)
@SpringBootApplication
public class UtilityApplication {

  public static void main(String[] args) {
    SpringApplication.run(UtilityApplication.class, args);
  }


}
