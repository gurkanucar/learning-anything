package com.gucardev.springsecurityjwtexample.security.magiclink;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.ott.OneTimeToken;
import org.springframework.security.web.authentication.ott.OneTimeTokenGenerationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Component
public class MagicLinkOneTimeTokenGenerationSuccessHandler implements OneTimeTokenGenerationSuccessHandler {

    private final String BASE_URL = "http://localhost:3000";

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, OneTimeToken oneTimeToken) {
        // send mail to user here
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(BASE_URL)
                .path("/login/ott")
                .queryParam("token", oneTimeToken.getTokenValue());
        String magicLink = builder.toUriString();
        String email = getUserEmail(oneTimeToken.getUsername());
        log.info(magicLink);
//        this.redirectHandler.handle(request, response, oneTimeToken);
        response.setStatus(HttpStatus.OK.value());
    }

    private String getUserEmail(String username) {
        // ...
        return username + "@gmail.com";
    }

}