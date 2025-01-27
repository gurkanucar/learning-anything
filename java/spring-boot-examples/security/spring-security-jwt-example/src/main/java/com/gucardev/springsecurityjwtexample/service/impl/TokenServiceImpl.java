package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.TokenRequest;
import com.gucardev.springsecurityjwtexample.entity.RefreshToken;
import com.gucardev.springsecurityjwtexample.service.JwtTokenService;
import com.gucardev.springsecurityjwtexample.service.RefreshTokenService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import com.gucardev.springsecurityjwtexample.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenServiceImpl implements TokenService {

    private final JwtTokenService jwtTokenService;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;

    @Override
    public TokenDto getTokenDto(TokenRequest tokenRequest) {
        String accessToken = jwtTokenService.generateToken(
                tokenRequest.getEmail(),
                tokenRequest.extractRolesAsStringSet()
        );
        var user = userService.getByEmail(tokenRequest.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        String refreshToken = refreshTokenService.generateAndSaveRefreshToken(user);
        return TokenDto.buildTokenDto(user, accessToken, refreshToken);
    }

    @Override
    public TokenDto refreshToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenValue);
        if (!refreshTokenService.isTokenValid(refreshToken)) {
            throw new RuntimeException("Refresh token is expired or invalid!");
        }
        return getTokenDto(TokenRequest.builder().email(refreshToken.getUser().getEmail()).roles(refreshToken.getUser().getRoles()).build());
    }


}

