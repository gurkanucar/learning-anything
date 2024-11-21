package com.gucardev.utility;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class Address {

  @Schema(
      description = "The street name or number",
      example = "123 Main St",
      type = "string"
  )
  @NotBlank
  private String street;

  @Schema(
      description = "The city name",
      example = "New York",
      type = "string"
  )
  @NotBlank
  private String city;

  @Schema(
      description = "A title or identifier for the address",
      example = "Home Address",
      type = "string",
      minLength = 5,
      maxLength = 25
  )
  @Length(min = 5, max = 25)
  private String title;

  @Schema(
      description = "The postal or ZIP code",
      example = "12345",
      type = "integer",
      minimum = "10000",
      maximum = "99999"
  )
  @NotNull
  @Min(10000)
  @Max(99999)
  private Integer postalCode;

  @Schema(
      description = "Flat",
      example = "3",
      type = "integer",
      minimum = "0",
      maximum = "99999"
  )
  @NotNull
  @Positive
  private Integer flat;

  @Schema(
      description = "Country code following ISO 3166-1 alpha-2 format",
      example = "US",
      type = "string",
      pattern = "^[A-Z]$"
  )
  @Pattern(regexp = "^[A-Z]{2}$", message = "{javax.validation.Pattern.message}")
  private String countryCode;

  @Schema(
      description = "The latitude coordinate",
      example = "40.7128",
      type = "double"
  )
  @NotNull
  private Double latitude;

  @Schema(
      description = "The longitude coordinate",
      example = "-74.0060",
      type = "double"
  )
  @NotNull
  private Double longitude;
}
