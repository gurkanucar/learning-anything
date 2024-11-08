package com.gucardev.rediscachingexample.infra;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "cache-config")
public class CacheProperties {

    private DefaultConfig defaultConfig;
    private CustomerConfig customerConfig;

    @Getter
    @Setter
    public static class DefaultConfig {
        private int entryTtl;
    }

    @Getter
    @Setter
    public static class CustomerConfig {
        private int entryTtl;
        private String customerCacheName;
    }
}
