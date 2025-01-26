package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.mapper.UserMapper;
import com.gucardev.springsecurityjwtexample.security.CustomUserDetails;
import com.gucardev.springsecurityjwtexample.service.AuthService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
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
    private final TokenService tokenService;

    @Override
    public TokenDto login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticateUser(loginRequest);
            return tokenService.getTokenDto(getPrincipal(authentication).getUser());
        } catch (Exception e) {
            log.error("Error during login for user: {}", loginRequest.getUsername(), e);
            throw new RuntimeException("Login failed: invalid username or password");
        }
    }

    private static CustomUserDetails getPrincipal(Authentication authentication) {
        return (CustomUserDetails) authentication.getPrincipal();
    }

    @Override
    public UserDto getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAuthenticated(authentication)) {
            return UserMapper.toDto(getPrincipal(authentication).getUser());
        }
        throw new IllegalStateException("No authenticated user found");
    }

    @Override
    public TokenDto refreshToken(String refreshToken) {
        return tokenService.refreshToken(refreshToken);
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

