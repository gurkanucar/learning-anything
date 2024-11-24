package com.gucardev.springsecurityjwtexample.service;


import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto;

public interface AuthService {

    TokenDto login(LoginRequest loginRequest);

    UserDto getAuthenticatedUser();

    void logout(String logoutRequest);
}
