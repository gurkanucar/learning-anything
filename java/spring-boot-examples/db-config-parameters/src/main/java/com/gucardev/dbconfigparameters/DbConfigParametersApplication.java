package com.gucardev.dbconfigparameters;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class DbConfigParametersApplication {

  public static void main(String[] args) {
    SpringApplication.run(DbConfigParametersApplication.class, args);
  }

}
