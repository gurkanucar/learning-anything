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

    private static final long TOKEN_VALIDITY_DAYS = 7; // Or configure in properties
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    @Override
    public String generateAndSaveRefreshToken(User user) {
        // Delete old tokens for that user
        refreshTokenRepository.deleteByUser(user);

        // Create and save a new refresh token
        String tokenValue = UUID.randomUUID().toString();
        Date expiryDate = Date.from(Instant.now().plus(TOKEN_VALIDITY_DAYS, ChronoUnit.DAYS));

        RefreshToken refreshToken = RefreshToken.builder()
                .token(tokenValue)
                .expiryDate(expiryDate)
                .user(user)
                .build();

        refreshTokenRepository.save(refreshToken);
        return tokenValue;
    }

    @Override
    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found!"));
    }

    @Override
    public boolean isTokenValid(RefreshToken token) {
        return token.getExpiryDate().after(new Date());
    }
}