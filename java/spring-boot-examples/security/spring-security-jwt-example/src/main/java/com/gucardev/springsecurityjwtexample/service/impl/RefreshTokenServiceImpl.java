package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.entity.RefreshToken;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.RefreshTokenRepository;
import com.gucardev.springsecurityjwtexample.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public String generateAndSaveRefreshToken(User user) {
        // Delete old tokens for that user
        refreshTokenRepository.deleteByUser(user);

        // Create and save a new refresh token
        String token = UUID.randomUUID().toString();
        Date expiryDate = Date.from(Instant.now().plus(7, ChronoUnit.DAYS));

        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .expiryDate(expiryDate)
                .user(user)
                .build();

        refreshTokenRepository.save(refreshToken);

        return token;
    }

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found!"));
    }

    public boolean isTokenValid(RefreshToken token) {
        return token.getExpiryDate().after(new Date());
    }
}
