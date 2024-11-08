package com.gucardev.rediscachingexample.infra;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


import java.util.Map;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "cache-config")
public class CacheProperties {

    private DefaultConfig defaultConfig;
    private Map<String, CustomCacheConfig> customCaches;

    @Getter
    @Setter
    public static class DefaultConfig {
        private int entryTtl;
    }

    @Getter
    @Setter
    public static class CustomCacheConfig {
        private int entryTtl;
    }
}
