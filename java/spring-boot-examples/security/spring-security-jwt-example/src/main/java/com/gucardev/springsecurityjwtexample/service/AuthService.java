package com.gucardev.springsecurityjwtexample.service;


import com.gucardev.springsecurityjwtexample.dto.AuthResponse;
import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.LogoutRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto;

public interface AuthService {

    TokenDto login(LoginRequest loginRequest);

    AuthResponse validate(String token);

    UserDto getAuthenticatedUser();

    void logout(LogoutRequest logoutRequest);
}
