package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.entity.RefreshToken;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.mapper.UserMapper;
import com.gucardev.springsecurityjwtexample.security.CustomUserDetails;
import com.gucardev.springsecurityjwtexample.service.AuthService;
import com.gucardev.springsecurityjwtexample.service.JwtTokenService;
import com.gucardev.springsecurityjwtexample.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService tokenService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public TokenDto login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticateUser(loginRequest);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            String accessToken = tokenService.generateToken(user);
            String refreshToken = refreshTokenService.generateAndSaveRefreshToken(user);

            return TokenDto.buildTokenDto(user, accessToken, refreshToken);
        } catch (Exception e) {
            log.error("Error during login for user: {}", loginRequest.getUsername(), e);
            throw new RuntimeException("Login failed: invalid username or password");
        }
    }

    @Override
    public UserDto getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAuthenticated(authentication)) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return UserMapper.toDto(userDetails.getUser());
        }
        throw new IllegalStateException("No authenticated user found");
    }

    @Override
    public TokenDto refreshToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenValue);
        if (!refreshTokenService.isTokenValid(refreshToken)) {
            throw new RuntimeException("Refresh token is expired or invalid!");
        }
        User user = refreshToken.getUser();
        String newAccessToken = tokenService.generateToken(user);
        String newRefreshToken = refreshTokenService.generateAndSaveRefreshToken(user);
        return TokenDto.buildTokenDto(user, newAccessToken, newRefreshToken);
    }

    private Authentication authenticateUser(LoginRequest loginRequest) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null && authentication.isAuthenticated();
    }
}

