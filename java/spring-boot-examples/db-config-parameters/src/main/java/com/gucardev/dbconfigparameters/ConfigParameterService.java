package com.gucardev.dbconfigparameters;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ConfigParameterService {

  private final ConfigParameterRepository repository;

  public ConfigParameterService(ConfigParameterRepository repository) {
    this.repository = repository;
  }

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
  }

  public List<ConfigParameter> getAllParams() {
    return repository.findAll();
  }
}
