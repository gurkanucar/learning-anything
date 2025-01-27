package com.gucardev.springsecurityjwtexample.service;


import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto;
import jakarta.validation.constraints.NotBlank;

public interface AuthService {
    TokenDto login(LoginRequest loginRequest);
    UserDto getAuthenticatedUser();
    TokenDto refreshToken(@NotBlank String refreshToken);
}