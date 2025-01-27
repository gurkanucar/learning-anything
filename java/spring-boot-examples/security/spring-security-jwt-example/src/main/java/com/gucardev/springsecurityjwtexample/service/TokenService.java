package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.entity.User;

public interface TokenService {
    TokenDto getTokenDto(User user);
    TokenDto refreshToken(String refreshTokenValue);
}
