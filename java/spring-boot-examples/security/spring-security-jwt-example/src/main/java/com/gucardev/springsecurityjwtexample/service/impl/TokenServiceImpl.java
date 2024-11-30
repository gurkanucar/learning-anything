package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.dto.OtpValidateRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.entity.Token;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.TokenRepository;
import com.gucardev.springsecurityjwtexample.service.JwtDecoderService;
import com.gucardev.springsecurityjwtexample.service.JwtEncoderService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import com.gucardev.springsecurityjwtexample.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

  @Value("${jwt-variables.refresh-token-expiration-time}")
  private long refreshTokenExpirationTime;

  private final TokenRepository tokenRepository;
  private final JwtDecoderService jwtDecoderService;
  private final JwtEncoderService jwtEncoderService;
  private final UserService userService;


  @Transactional
  @Override
  public TokenDto createNewTokenForUser(User user) {
    var tokenEntity = createNewTokenSignatureForUser(user);
    String token = jwtEncoderService.generateToken(user.getUsername(),
        user.getRoles().stream().map(Enum::name)
            .collect(Collectors.toList()),
        tokenEntity.getTokenSign());
    return new TokenDto(tokenEntity.getTokenSign(), user.getOtpEnabled(), token,
        tokenEntity.getRefreshToken(),
        userService.getDtoByUsername(user.getUsername()));
  }

  @Transactional
  public Integer createOtp(String tokenSign) {
    var token = tokenRepository.findByTokenSign(tokenSign)
        .orElseThrow(() -> new EntityNotFoundException("Token not found"));
    // Generate a random 4-digit OTP
    int otpCode = (int) (Math.random() * 9000) + 1000; // Random number between 1000-9999
    // Set OTP code and expiration time (e.g., 5 minutes from now)
    token.setOtpCode(otpCode);
    token.setOtpExpiration(new Date(System.currentTimeMillis() + 60 * 1000)); // 1 minutes
    token.setOtpValidated(false);
    tokenRepository.save(token);
    log.info("otp: {}, created for user {}", otpCode, token.getUser().getUsername());
    return otpCode;
  }

  @Transactional
  public boolean isOtpValid(OtpValidateRequest otpValidateRequest) {
    var token = tokenRepository.findByTokenSign(otpValidateRequest.getTokenSign())
        .orElseThrow(() -> new EntityNotFoundException("Token not found"));
    if (token.getOtpExpiration().before(new Date())) {
      throw new RuntimeException("OTP is expired");
    }
    if (!token.getOtpCode().equals(otpValidateRequest.getOtpCode())) {
      throw new RuntimeException("Invalid OTP code");
    }
    token.setOtpValidated(true);
    tokenRepository.save(token);
    return true;
  }


  @Transactional
  @Override
  public TokenDto createNewTokenWithRefreshToken(String refreshToken) {
    var token = tokenRepository.findByRefreshToken(refreshToken)
        .orElseThrow(() -> new EntityNotFoundException("Token not found"));
    if (token.getRefreshTokenExpiration().before(new Date())) {
      tokenRepository.delete(token);
      throw new RuntimeException("Refresh token is expired");
    }
    var newCreatedToken = createNewTokenForUser(token.getUser());
    tokenRepository.deleteByRefreshToken(refreshToken);
    return newCreatedToken;
  }


  @Transactional
  @Override
  public void invalidateTokenSignature(String signature) {
    tokenRepository.deleteByTokenSign(signature);
  }

  @Override
  public String validateTokenAndReturnUsername(String token) {
    String username = jwtDecoderService.extractUsername(token);
    var user = userService.getByUsername(username);
    String tokenSign = jwtDecoderService.extractTokenSign(token);
    Token storedToken = getStoredToken(tokenSign);
    validateOtpIfEnabled(user, storedToken);
    validateTokenSignature(token, storedToken);
    return username;
  }


  public Token createNewTokenSignatureForUser(User user) {
    // Check how many tokens the user currently has
    long tokenCount = tokenRepository.countByUser(user);

    if (tokenCount >= 5) {
      // If the user has 5 or more tokens, delete the oldest one
      Token oldestToken = tokenRepository.findOldestTokenByUser(user).getFirst();
      if (oldestToken != null) {
        tokenRepository.delete(oldestToken);
      }
    }
    // Create a new token
    String tokenSign = UUID.randomUUID().toString();
    String refreshToken = UUID.randomUUID().toString();
    Token tokenEntity = new Token();
    tokenEntity.setTokenSign(tokenSign);
    tokenEntity.setRefreshToken(refreshToken);
    tokenEntity.setUser(user);
    tokenEntity.setRefreshTokenExpiration(
        new Date(System.currentTimeMillis() + refreshTokenExpirationTime));
    return tokenRepository.save(tokenEntity);
  }

  @Transactional
  @Override
  public void invalidateTokenByAuthorizationHeader(String authorizationHeader) {
    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
      String jwt = authorizationHeader.substring(7);
      String tokenSign = jwtDecoderService.extractTokenSign(jwt);
      invalidateTokenSignature(tokenSign);
    }
  }

  private Token getStoredToken(String tokenSign) {
    return tokenRepository.findByTokenSign(tokenSign)
        .orElseThrow(() -> new EntityNotFoundException("Token not found"));
  }

  private void validateOtpIfEnabled(User user, Token storedToken) {
    if (Boolean.TRUE.equals(user.getOtpEnabled()) &&
        Boolean.FALSE.equals(storedToken.getOtpValidated())) {
      throw new RuntimeException("Invalid OTP");
    }
  }

  private void validateTokenSignature(String token, Token storedToken) {
    if (!jwtDecoderService.isTokenValid(token, storedToken.getTokenSign())) {
      throw new RuntimeException("Invalid token");
    }
  }

}
