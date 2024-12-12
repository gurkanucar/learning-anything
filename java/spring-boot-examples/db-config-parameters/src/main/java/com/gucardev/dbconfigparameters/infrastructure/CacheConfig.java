package com.gucardev.dbconfigparameters.infrastructure;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.beans.factory.annotation.Value;

@Configuration
public class CacheConfig {

  @Value("${cache.config.names}")
  private String[] cacheNames;

  @Bean
  public CacheManager cacheManager() {
    return new ConcurrentMapCacheManager(cacheNames);
  }
}
