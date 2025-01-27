package com.gucardev.springsecurityjwtexample.security.oauth.github;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GithubEmail {
    private String email;
    private boolean primary;
    private boolean verified;
}
