package com.gucardev.springsecurityjwtexample.security.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.TokenRequest;
import com.gucardev.springsecurityjwtexample.entity.Role;
import com.gucardev.springsecurityjwtexample.security.oauth.github.CustomGithubOAuth2UserService;
import com.gucardev.springsecurityjwtexample.security.oauth.google.CustomGoogleOAuth2UserService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.client.OAuth2LoginConfigurer;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Set;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class OAuth2SecurityConfig {

    private final CustomGithubOAuth2UserService githubOAuth2UserService;
    private final CustomGoogleOAuth2UserService googleOAuth2UserService;
    private final TokenService tokenService;

    @Value("${oauth2.success-redirect-url}")
    private String oauth2SuccessRedirectUri;

    @Value("${oauth2.failure-redirect-url}")
    private String oauth2FailureRedirectUri;

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        return oAuth2UserRequest -> {
            String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
            return switch (registrationId) {
                case "github" -> githubOAuth2UserService.loadUser(oAuth2UserRequest);
                case "google" -> googleOAuth2UserService.loadUser(oAuth2UserRequest);
                default -> throw new IllegalArgumentException("Unsupported provider: " + registrationId);
            };
        };
    }

    @Bean
    public AuthenticationSuccessHandler oauth2SuccessHandler() {
        return (request, response, authentication) -> {
            Object principal = authentication.getPrincipal();
            String email = extractEmail(principal);
            log.info("User from plain OAuth2 Provider: {}", email);
            // Generate the token DTO
            TokenDto token = tokenService.getTokenDto(
                    TokenRequest.builder()
                            .email(email)
                            .roles(Set.of(Role.USER))
                            .build()
            );
            ObjectMapper objectMapper = new ObjectMapper();
            String tokenJson = objectMapper.writeValueAsString(token);
            String encodedToken = Base64.getEncoder().encodeToString(tokenJson.getBytes(StandardCharsets.UTF_8));
            String redirectUrl = oauth2SuccessRedirectUri.replace("{token}", encodedToken);
            response.sendRedirect(redirectUrl);
        };
    }

    @Bean
    public AuthenticationFailureHandler oauth2FailureHandler() {
        return (request, response, exception) -> {
            String redirectUrl = oauth2FailureRedirectUri.replace("{error}", URLEncoder.encode(
                    exception.getMessage(),
                    StandardCharsets.UTF_8));
            response.sendRedirect(redirectUrl);
        };
    }

    private String extractEmail(Object principal) {
        return (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
    }

    public void configureOAuth2(OAuth2LoginConfigurer<HttpSecurity> oauth2) {
        oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(oauth2UserService()))
                .successHandler(oauth2SuccessHandler())
                .failureHandler(oauth2FailureHandler());
    }
}