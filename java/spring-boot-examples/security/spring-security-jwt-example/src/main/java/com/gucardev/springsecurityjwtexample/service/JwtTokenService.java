package com.gucardev.springsecurityjwtexample.service;

import java.util.List;

public interface JwtTokenService {
    String generateToken(String username, List<String> roles);
    boolean validateToken(String token);
    String getUsernameFromToken(String token);
}
