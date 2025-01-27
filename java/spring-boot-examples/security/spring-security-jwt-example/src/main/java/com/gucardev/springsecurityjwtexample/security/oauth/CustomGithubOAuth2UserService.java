package com.gucardev.springsecurityjwtexample.security.oauth;

import com.gucardev.springsecurityjwtexample.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomGithubOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;
    private final RestTemplateBuilder restTemplateBuilder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String email = (String) oAuth2User.getAttributes().get("email");
        String avatarUrl = (String) oAuth2User.getAttributes().get("avatar_url");

        // If email is null, call the extra /user/emails endpoint
        if (email == null) {
            String accessToken = userRequest.getAccessToken().getTokenValue();
            email = fetchPrimaryEmailFromGithub(accessToken);
        }

        // (Optionally) create or update your DB user here.
        // e.g. userService.saveUserIfNeeded(login, email, avatarUrl);

        // Put the final email value into a copy of the original attributes
        Map<String, Object> mergedAttributes = new HashMap<>(oAuth2User.getAttributes());
        mergedAttributes.put("email", email);  // now "email" is definitely not null (unless GitHub had none at all)

        // Return a new DefaultOAuth2User with those merged attributes
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                mergedAttributes,
                "login"  // "login" is a safe principal key that GitHub always provides
        );
    }


    /**
     * Calls https://api.github.com/user/emails to retrieve the primary email.
     */
    private String fetchPrimaryEmailFromGithub(String accessToken) {
        RestTemplate restTemplate = restTemplateBuilder.build();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Accept", "application/vnd.github.v3+json");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List<GithubEmail>> response = restTemplate.exchange(
                "https://api.github.com/user/emails",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
                }
        );

        List<GithubEmail> emails = response.getBody();
        if (emails == null || emails.isEmpty()) {
            return null;
        }

        // GitHub can return multiple emails, find the primary or first verified
        // e.g. find .stream().filter(e -> e.isPrimary()).findFirst()...
        return emails.stream()
                .filter(GithubEmail::isPrimary)
                .map(GithubEmail::getEmail)
                .findFirst()
                .orElse(emails.getFirst().getEmail());
    }

    @Data
    public static class GithubEmail {
        private String email;
        private boolean primary;
        private boolean verified;
    }
}
