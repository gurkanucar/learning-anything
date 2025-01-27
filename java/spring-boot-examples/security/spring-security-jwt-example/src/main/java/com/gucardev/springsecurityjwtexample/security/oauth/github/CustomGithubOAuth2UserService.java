package com.gucardev.springsecurityjwtexample.security.oauth.github;

import com.gucardev.springsecurityjwtexample.entity.Role;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomGithubOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final UserService userService;
    private final GithubApiClient githubApiClient;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        String email = getEmailForUser(userRequest, oAuth2User);
        processUser(oAuth2User, email);
        return mapToOAuth2User(oAuth2User, email);
    }

    private String getEmailForUser(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String email = (String) oAuth2User.getAttributes().get("email");
        if (email == null) {
            log.debug("Email not found in primary attributes, fetching from GitHub API");
            String accessToken = userRequest.getAccessToken().getTokenValue();
            email = fetchPrimaryEmail(accessToken);
        }
        if (email == null) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("email_not_found", "No email found for GitHub user", null));
        }
        return email;
    }

    private String fetchPrimaryEmail(String accessToken) {
        return githubApiClient.fetchEmails(accessToken).stream()
                .filter(GithubEmail::isPrimary)
                .map(GithubEmail::getEmail)
                .findFirst()
                .orElseGet(() -> githubApiClient.fetchEmails(accessToken)
                        .stream()
                        .findFirst()
                        .map(GithubEmail::getEmail)
                        .orElse(null));
    }

    private void processUser(OAuth2User oAuth2User, String email) {
        User user = userService.getByEmail(email)
                .orElseGet(() -> mapToUser(oAuth2User.getAttributes(), email));
        userService.upsertForOauth(user);
    }

    private User mapToUser(Map<String, Object> attributes, String email) {
        return User.builder()
                .email(email)
                .name((String) attributes.get("login"))
                .profilePicture((String) attributes.get("avatar_url"))
                .roles(Set.of(Role.USER))
                .build();
    }

    private OAuth2User mapToOAuth2User(OAuth2User originalUser, String email) {
        Map<String, Object> mergedAttributes = new HashMap<>(originalUser.getAttributes());
        mergedAttributes.put("email", email);
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(Role.USER.name())),
                mergedAttributes,
                "email"
        );
    }
}

