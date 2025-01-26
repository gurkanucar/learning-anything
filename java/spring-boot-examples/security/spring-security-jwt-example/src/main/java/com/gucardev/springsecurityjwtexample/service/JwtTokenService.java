package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.entity.User;

public interface JwtTokenService {

    String generateToken(User user);
    boolean validateToken(String token);
    String getUsernameFromToken(String token);

}
