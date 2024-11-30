package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.entity.Token;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.TokenRepository;
import com.gucardev.springsecurityjwtexample.service.JwtDecoderService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import com.gucardev.springsecurityjwtexample.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

  @Value("${jwt-variables.expiration-time}")
  private long jwtExpiration;

  private final TokenRepository tokenRepository;
  private final JwtDecoderService jwtDecoderService;
  private final UserService userService;


  @Transactional
  @Override
  public String createNewTokenSignatureForUser(User user) {
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
    Token tokenEntity = new Token();
    tokenEntity.setTokenSign(tokenSign);
    tokenEntity.setUser(user);
    tokenEntity.setExpiration(new Date(System.currentTimeMillis() + jwtExpiration));

    tokenRepository.save(tokenEntity);
    return tokenSign;
  }

  @Transactional
  @Override
  public void invalidateTokenSignature(String signature) {
    tokenRepository.deleteByTokenSign(signature);
  }

  @Override
  public void validateToken(String token) {
    String username = jwtDecoderService.extractUsername(token);
    // check user is exist by username
    userService.getByUsername(username);
    String tokenSign = jwtDecoderService.extractTokenSign(token);

    Token storedToken = tokenRepository.findByTokenSignAndUser_Username(tokenSign, username)
        .orElseThrow(() -> new EntityNotFoundException("Token not found"));

    if (!jwtDecoderService.isTokenValid(token, storedToken.getTokenSign())) {
      throw new RuntimeException("Invalid token");
    }
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
}
