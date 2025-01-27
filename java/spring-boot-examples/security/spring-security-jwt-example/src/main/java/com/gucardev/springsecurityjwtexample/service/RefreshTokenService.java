package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.entity.RefreshToken;
import com.gucardev.springsecurityjwtexample.entity.User;

public interface RefreshTokenService {
    String generateAndSaveRefreshToken(User user);
    RefreshToken findByToken(String token);
    boolean isTokenValid(RefreshToken token);
}
