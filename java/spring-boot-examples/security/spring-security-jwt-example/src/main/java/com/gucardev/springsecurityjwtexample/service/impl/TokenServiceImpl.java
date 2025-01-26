package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.entity.RefreshToken;
import com.gucardev.springsecurityjwtexample.entity.Role;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.service.JwtTokenService;
import com.gucardev.springsecurityjwtexample.service.RefreshTokenService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenServiceImpl implements TokenService {

    private final JwtTokenService tokenService;
    private final RefreshTokenService refreshTokenService;


    @Override
    public TokenDto getTokenDto(User userDetails) {
        String accessToken = tokenService.generateToken(userDetails.getUsername(),
                getRoles(userDetails));
        String refreshToken = refreshTokenService.generateAndSaveRefreshToken(userDetails);

        return TokenDto.buildTokenDto(userDetails, accessToken, refreshToken);
    }

    private static List<String> getRoles(User user) {
        return user.getRoles()
                .stream()
                .map(Role::name)
                .collect(Collectors.toList());
    }


    @Override
    public TokenDto refreshToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenValue);
        if (!refreshTokenService.isTokenValid(refreshToken)) {
            throw new RuntimeException("Refresh token is expired or invalid!");
        }
        return getTokenDto(refreshToken.getUser());
    }

}

