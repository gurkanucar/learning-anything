package com.gucardev.springsecurityjwtexample.service;


import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.OtpValidateRequest;
import com.gucardev.springsecurityjwtexample.dto.RefreshTokenRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto;
import jakarta.validation.Valid;

public interface AuthService {

  TokenDto login(LoginRequest loginRequest);

  UserDto getAuthenticatedUser();

  void logout(String authorizationHeader);

  TokenDto refreshToken(@Valid RefreshTokenRequest refreshTokenRequest);

  boolean validateOtp(@Valid OtpValidateRequest otpValidateRequest);
}