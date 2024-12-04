package com.gucardev.dbconfigparameters;

import java.math.BigDecimal;

public class ConfigParam {

  private final String value;

  public ConfigParam(String value) {
    this.value = value;
  }

  /**
   * Convert value to String.
   */
  public String asString() {
    return value;
  }

  /**
   * Convert value to Integer.
   */
  public Integer asInteger() {
    try {
      return Integer.parseInt(value);
    } catch (NumberFormatException e) {
      throw new IllegalArgumentException("Value cannot be converted to Integer: " + value);
    }
  }

  /**
   * Convert value to Long.
   */
  public Long asLong() {
    try {
      return Long.parseLong(value);
    } catch (NumberFormatException e) {
      throw new IllegalArgumentException("Value cannot be converted to Long: " + value);
    }
  }

  /**
   * Convert value to Double.
   */
  public Double asDouble() {
    try {
      return Double.parseDouble(value);
    } catch (NumberFormatException e) {
      throw new IllegalArgumentException("Value cannot be converted to Double: " + value);
    }
  }

  /**
   * Convert value to BigDecimal.
   */
  public BigDecimal asBigDecimal() {
    try {
      return new BigDecimal(value);
    } catch (NumberFormatException e) {
      throw new IllegalArgumentException("Value cannot be converted to BigDecimal: " + value);
    }
  }

  /**
   * Convert value to Boolean.
   */
  public Boolean asBoolean() {
    return Boolean.parseBoolean(value);
  }

  /**
   * Convert value to String array (split by commas).
   */
  public String[] asStringArray() {
    return value.split(",");
  }

  /**
   * Convert value to Integer array (split by commas).
   */
  public Integer[] asIntegerArray() {
    try {
      String[] parts = value.split(",");
      Integer[] integers = new Integer[parts.length];
      for (int i = 0; i < parts.length; i++) {
        integers[i] = Integer.parseInt(parts[i].trim());
      }
      return integers;
    } catch (NumberFormatException e) {
      throw new IllegalArgumentException("Value cannot be converted to Integer array: " + value);
    }
  }
}
