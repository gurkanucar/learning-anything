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
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomGithubOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;
    private final GithubApiClient githubApiClient;

    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        String accessToken = userRequest.getAccessToken().getTokenValue();
        String email = githubApiClient.extractEmail(oAuth2User, accessToken);
        User user = userService.getByEmail(email)
                .orElseGet(() -> mapToUser(oAuth2User.getAttributes(), email));
        userService.upsertForOauth(user);
        return mapToOAuth2User(oAuth2User, email);
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

