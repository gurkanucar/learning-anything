package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.TokenRequest;
import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.entity.User;
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
            User user = extractUser(authentication);
            return tokenService.getTokenDto(TokenRequest.builder().email(user.getEmail()).roles(user.getRoles()).build());
        } catch (Exception ex) {
            log.error("Authentication error for user: {}", loginRequest.getEmail(), ex);
            throw new RuntimeException("Authentication failed", ex);
        }
    }

    @Override
    public UserDto getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAuthenticated(authentication)) {
            User user = extractUser(authentication);
            return UserMapper.toDto(user);
        }
        throw new RuntimeException("No authenticated user found");
    }

    @Override
    public TokenDto refreshToken(String refreshToken) {
        return tokenService.refreshToken(refreshToken);
    }

    // --- Private Helpers ---

    private Authentication authenticateUser(LoginRequest loginRequest) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
    }

    private User extractUser(Authentication authentication) {
        if (!isAuthenticated(authentication)) {
            throw new RuntimeException("No valid authentication found");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomUserDetails)) {
            throw new RuntimeException("Principal is not of expected type");
        }

        return ((CustomUserDetails) principal).getUser();
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null && authentication.isAuthenticated();
    }
}


