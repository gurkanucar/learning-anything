package com.gucardev.dbconfigparameters.infrastructure;


import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class CacheConstants {

  @Value("${cache.config.names}")
  private String cacheNames;

  @Value("${cache.config.ttl}")
  private long ttl;

  public String[] getCacheNames() {
    return cacheNames.split(",");
  }

}
