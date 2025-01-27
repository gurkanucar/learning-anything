package com.gucardev.springsecurityjwtexample.security.oauth;

import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;


@Service
@RequiredArgsConstructor
public class CustomGoogleOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        // Step 1: Use default Spring user service to load user
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // Step 2: Extract Google details
        // Google returns attributes like "sub", "email", "picture", "given_name", "family_name", etc.
        String googleId = (String) oAuth2User.getAttributes().get("sub");
        String email = (String) oAuth2User.getAttributes().get("email");
        String name = (String) oAuth2User.getAttributes().get("name");
        String picture = (String) oAuth2User.getAttributes().get("picture");

        // Step 3: Create or update user in your local DB
        // e.g. find by googleId or email
        //User user = userService.findByGoogleIdOrEmail(googleId, email);
      //  User user = userService.getByEmail(email);

        // If user doesn't exist, create a new one
        // user = new User();
        // user.setGoogleId(googleId);

       // user.setName(name);
       // user.setEmail(email);
//        user.setAvatarUrl(picture);
        // userService.saveOrUpdate(user);

        // Step 4: Return OAuth2User with desired authorities
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oAuth2User.getAttributes(),
                "name" // "name" is the key for the user's name in Google's response
        );
    }
}
