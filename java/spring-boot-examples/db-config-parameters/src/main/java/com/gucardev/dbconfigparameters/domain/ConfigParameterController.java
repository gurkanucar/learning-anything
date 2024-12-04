package com.gucardev.dbconfigparameters.domain;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/config")
public class ConfigParameterController {

  private final ConfigParameterService configParameterService;

  public ConfigParameterController(ConfigParameterService configParameterService) {
    this.configParameterService = configParameterService;
  }

  /**
   * Get a configuration parameter value by name.
   */
  @GetMapping("/{name}")
  public ResponseEntity<Object> getParam(
      @PathVariable String name,
      @RequestParam(defaultValue = "string") String type) {
    try {
      ConfigParam param = configParameterService.getParam(name);

      Object result = switch (type.toLowerCase()) {
        case "integer" -> param.asInteger();
        case "long" -> param.asLong();
        case "double" -> param.asDouble();
        case "bigdecimal" -> param.asBigDecimal();
        case "boolean" -> param.asBoolean();
        case "stringarray" -> param.asStringArray();
        case "integerarray" -> param.asIntegerArray();
        default -> param.asString();
      };

      return ResponseEntity.ok(result);

    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
    }
  }

  /**
   * Set or update a configuration parameter.
   */
  @PostMapping
  public ResponseEntity<String> setParam(@RequestParam String name, @RequestParam String value) {
    configParameterService.setParam(name, value);
    return ResponseEntity.ok("Parameter set successfully.");
  }

  /**
   * Get all configuration parameters.
   */
  @GetMapping
  public ResponseEntity<List<ConfigParameter>> getAllParams() {
    List<ConfigParameter> params = configParameterService.getAllParams();
    return ResponseEntity.ok(params);
  }
}
