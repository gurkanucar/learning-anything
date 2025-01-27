package com.gucardev.springsecurityjwtexample.security;

import lombok.Getter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;


// it keeps other details with UsernamePasswordAuthentication token in SecurityContextHolder
@Getter
public class CustomUsernamePasswordAuthenticationToken extends UsernamePasswordAuthenticationToken {

    private final String jwtToken;

    public CustomUsernamePasswordAuthenticationToken(
            Object principal, Collection<? extends GrantedAuthority> authorities, String jwtToken) {
        super(principal, null, authorities);
        this.jwtToken = jwtToken;
    }
}
