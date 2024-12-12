package com.gucardev.dbconfigparameters.infrastructure;

import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CacheEvictionScheduler {

  private final CacheManager cacheManager;
  private final CacheConstants cacheConstants;

  public CacheEvictionScheduler(CacheManager cacheManager, CacheConstants cacheConstants) {
    this.cacheManager = cacheManager;
    this.cacheConstants = cacheConstants;
  }

  @Async
  @Scheduled(fixedRateString = "#{cacheConstants.ttl}")
  public void evictAllCaches() {
    for (String cacheName : cacheConstants.getCacheNames()) {
      if (cacheManager.getCache(cacheName) != null) {
        Objects.requireNonNull(cacheManager.getCache(cacheName)).clear();
        log.info("Evicting cache {}", cacheName);
      }
    }
  }
}

