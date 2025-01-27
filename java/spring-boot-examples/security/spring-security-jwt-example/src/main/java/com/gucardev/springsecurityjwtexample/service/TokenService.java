package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.TokenRequest;
import com.gucardev.springsecurityjwtexample.entity.User;

public interface TokenService {
    TokenDto getTokenDto(TokenRequest tokenRequest);
    TokenDto refreshToken(String refreshTokenValue);
}
