package com.gucardev.springsecurityjwtexample.security.oauth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.client.OAuth2LoginConfigurer;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.util.logging.Logger;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class OAuth2SecurityConfig {
    private final CustomGithubOAuth2UserService githubOAuth2UserService;
    private final CustomGoogleOAuth2UserService googleOAuth2UserService;

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
            String token = "some-jwt";
            response.sendRedirect("http://127.0.0.1:5500/index.html?token=" + token);
        };
    }

    @Bean
    public AuthenticationFailureHandler oauth2FailureHandler() {
        return (request, response, exception) -> {
            response.sendRedirect("http://127.0.0.1:5500/index.html/login?error=" + exception.getMessage());
        };
    }

    private String extractEmail(Object principal) {
        if (principal instanceof DefaultOidcUser oidcUser) {
            return oidcUser.getEmail();
        } else if (principal instanceof DefaultOAuth2User oauth2User) {
            return (String) oauth2User.getAttributes().get("email");
        }
        return "";
    }

    public void configureOAuth2(OAuth2LoginConfigurer<HttpSecurity> oauth2) {
        oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(oauth2UserService()))
                .successHandler(oauth2SuccessHandler())
                .failureHandler(oauth2FailureHandler());
    }
}