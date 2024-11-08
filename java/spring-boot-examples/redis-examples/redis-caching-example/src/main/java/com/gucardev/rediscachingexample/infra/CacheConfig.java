package com.gucardev.rediscachingexample.infra;

import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;

import static com.gucardev.rediscachingexample.infra.Constants.CUSTOMER_CACHE_NAME;

@Configuration
@EnableCaching
public class CacheConfig {

    private final CacheProperties cacheProperties;

    public CacheConfig(CacheProperties cacheProperties) {
        this.cacheProperties = cacheProperties;
    }


    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration
                .defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(cacheProperties.getDefaultConfig().getEntryTtl()))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }

    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer() {
        return builder -> {
            var countryNamesConf = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(cacheProperties.getCustomerConfig().getEntryTtl()));
            builder.withCacheConfiguration(CUSTOMER_CACHE_NAME, countryNamesConf);
        };
    }
}
