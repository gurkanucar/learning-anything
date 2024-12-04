package com.gucardev.dbconfigparameters.domain;

import java.util.List;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ConfigParameterService {

  private final ConfigParameterRepository repository;

  public ConfigParameterService(ConfigParameterRepository repository) {
    this.repository = repository;
  }

  @Cacheable(value = "configParams", key = "#paramName", unless = "#result == null")
  public ConfigParam getParam(String paramName) {
    ConfigParameter param = repository.findByConfigName(paramName)
        .orElseThrow(() -> new IllegalArgumentException("Parameter not found: " + paramName));
    return new ConfigParam(param.getConfigValue());
  }

  public void setParam(String paramName, String paramValue) {
    ConfigParameter param = repository.findByConfigName(paramName)
        .orElse(new ConfigParameter());
    param.setConfigName(paramName);
    param.setConfigValue(paramValue);
    repository.save(param);

    // Evict the cache for this parameter to ensure updated value is cached
    clearCacheForParam(paramName);
  }

  @Cacheable(value = "allConfigParams")
  public List<ConfigParameter> getAllParams() {
    return repository.findAll();
  }

  @CacheEvict(value = "configParams", key = "#paramName")
  public void clearCacheForParam(String paramName) {
    // Method for cache eviction
  }

  @CacheEvict(value = "allConfigParams", allEntries = true)
  public void clearCacheForAllParams() {
    // Method to clear all cache entries
  }
}
