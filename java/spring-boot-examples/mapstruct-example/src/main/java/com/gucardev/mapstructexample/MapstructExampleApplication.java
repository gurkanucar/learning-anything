package com.gucardev.mapstructexample;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@Slf4j
@SpringBootApplication
public class MapstructExampleApplication {

  public static void main(String[] args) {
    SpringApplication.run(MapstructExampleApplication.class, args);
    log.info("Mapstruct Example Application Started");
  }

}
