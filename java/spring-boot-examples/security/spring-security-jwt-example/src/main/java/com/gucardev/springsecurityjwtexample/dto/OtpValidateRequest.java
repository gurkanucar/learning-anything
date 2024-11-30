package com.gucardev.springsecurityjwtexample.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OtpValidateRequest {

  @NotBlank
  private String tokenSign;
  @NotNull
  private Integer otpCode;
}
