package com.gucardev.caffeinecacheexample1;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
@EnableCaching
public class CacheConfiguration {

  // Cache Name Constants
  public static final String CACHE_ENTITIES = "entitiesCache";
  public static final String CACHE_ONE = "cache1";
  public static final String CACHE_TWO = "cache2";

  // Cache Configuration Values
  @Value("${cache.default.initialCapacity}")
  private int initialCapacity;

  @Value("${cache.default.maximumSize}")
  private int maximumSize;

  @Value("${cache.expiration.seconds.cache1}")
  private int cache1ExpirationSeconds;

  @Value("${cache.expiration.seconds.cache2}")
  private int cache2ExpirationSeconds;

  @Primary
  @Bean
  public CacheManager cacheManager() {
    CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager();

    // Map of caches and their expiration settings
    Map<String, Duration> cacheConfigurations = Map.of(
        CACHE_ONE, Duration.ofSeconds(cache1ExpirationSeconds),
        CACHE_TWO, Duration.ofSeconds(cache2ExpirationSeconds),
        CACHE_ENTITIES, Duration.ofSeconds(20) // Default fallback
    );

    cacheConfigurations.forEach((cacheName, duration) ->
        caffeineCacheManager.registerCustomCache(
            cacheName,
            cacheBuilder(initialCapacity, maximumSize, duration)
        )
    );
    return caffeineCacheManager;
  }

  private Cache<Object, Object> cacheBuilder(int initialCapacity, int maximumSize, Duration duration) {
    return Caffeine.newBuilder()
        .initialCapacity(initialCapacity)
        .maximumSize(maximumSize)
        .expireAfterAccess(duration)
        .build();
  }
}
