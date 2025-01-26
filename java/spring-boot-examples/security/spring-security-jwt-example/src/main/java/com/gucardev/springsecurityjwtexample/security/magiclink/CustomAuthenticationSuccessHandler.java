package com.gucardev.springsecurityjwtexample.security.magiclink;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gucardev.springsecurityjwtexample.security.CustomUserDetails;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;
    private final TokenService tokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        response.setStatus(HttpStatus.OK.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        var authenticationPrincipal = (CustomUserDetails) authentication.getPrincipal();
        var token = tokenService.getTokenDto(authenticationPrincipal.getUser());
        objectMapper.writeValue(response.getWriter(), token);
    }
}