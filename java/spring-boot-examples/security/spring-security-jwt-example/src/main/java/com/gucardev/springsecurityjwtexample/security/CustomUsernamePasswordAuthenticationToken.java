package com.gucardev.springsecurityjwtexample.security;

import java.util.Collection;
import lombok.Getter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

@Getter
public class CustomUsernamePasswordAuthenticationToken extends UsernamePasswordAuthenticationToken {
    private final String token;

    public CustomUsernamePasswordAuthenticationToken(
            Object principal, Collection<? extends GrantedAuthority> authorities, String token) {
        super(principal, null, authorities);
        this.token = token;
    }
}
