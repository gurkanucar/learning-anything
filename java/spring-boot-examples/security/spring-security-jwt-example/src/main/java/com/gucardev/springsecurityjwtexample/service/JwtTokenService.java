package com.gucardev.springsecurityjwtexample.service;

import java.util.List;
import java.util.Set;

public interface JwtTokenService {
    String generateToken(String username, Set<String> roles);
    boolean validateToken(String token);
    String getUsernameFromToken(String token);
}
