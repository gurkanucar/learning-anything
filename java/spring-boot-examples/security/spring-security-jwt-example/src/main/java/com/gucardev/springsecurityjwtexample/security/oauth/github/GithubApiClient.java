package com.gucardev.springsecurityjwtexample.security.oauth.github;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GithubApiClient {
    private static final String GITHUB_API_EMAIL_URL = "https://api.github.com/user/emails";
    private final RestTemplateBuilder restTemplateBuilder;

    public String extractEmail(OAuth2User oAuth2User, String accessToken) {
        String email = (String) oAuth2User.getAttributes().get("email");
        if (email != null) {
            return email;
        }

        var emails = fetchEmails(accessToken);
        return emails.stream()
                .filter(GithubApiClient.GithubEmail::isPrimary)
                .map(GithubApiClient.GithubEmail::getEmail)
                .findFirst()
                .orElseGet(() -> emails.stream()
                        .findFirst()
                        .map(GithubApiClient.GithubEmail::getEmail)
                        .orElseThrow(() -> new OAuth2AuthenticationException(
                                new OAuth2Error("email_not_found", "No email found for GitHub user", null)))
                );
    }

    private List<GithubEmail> fetchEmails(String accessToken) {
        RestTemplate restTemplate = restTemplateBuilder.build();
        HttpHeaders headers = createAuthHeaders(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<List<GithubEmail>> response = restTemplate.exchange(
                GITHUB_API_EMAIL_URL,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
                }
        );

        return Optional.ofNullable(response.getBody())
                .orElseThrow(() -> new OAuth2AuthenticationException(
                        new OAuth2Error("github_email_error", "Failed to fetch GitHub emails", null)));
    }


    private HttpHeaders createAuthHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Accept", "application/vnd.github.v3+json");
        return headers;
    }

    @Getter
    @Setter
    public static class GithubEmail {
        private String email;
        private boolean primary;
        private boolean verified;
    }


}
