package com.gucardev.springsecurityjwtexample.security.oauth.github;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GithubApiClient {
    private final RestTemplateBuilder restTemplateBuilder;
    private static final String GITHUB_API_EMAIL_URL = "https://api.github.com/user/emails";

    public List<GithubEmail> fetchEmails(String accessToken) {
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
}
