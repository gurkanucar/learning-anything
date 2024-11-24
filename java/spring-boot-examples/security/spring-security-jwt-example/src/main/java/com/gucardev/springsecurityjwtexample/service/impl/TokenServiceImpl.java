package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.entity.Token;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.TokenRepository;
import com.gucardev.springsecurityjwtexample.service.JwtDecoderService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import com.gucardev.springsecurityjwtexample.service.UserService;
import java.util.Date;
import java.util.Optional;
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


  @Override
  public String createNewTokenSignatureForUser(User user) {
    var sign = UUID.randomUUID().toString();

    // Create a new Token entity
    Token tokenEntity = new Token();
    tokenEntity.setTokenSign(sign);
    tokenEntity.setUser(user);
    tokenEntity.setExpiration(new Date(System.currentTimeMillis() + jwtExpiration));

    // Save the user (tokens will cascade)
    tokenRepository.save(tokenEntity);
    return sign;
  }


  @Transactional
  @Override
  public void invalidateTokenSignature(String signature) {
    tokenRepository.deleteByTokenSign(signature);
  }

  @Override
  public Optional<Token> findByTokenSignAndUsername(String tokenSign, User user) {
    return tokenRepository.findByTokenSignAndUser(tokenSign, user);
  }

  @Override
  public void validateToken(String token) {
    User user = userService.getByUsername(jwtDecoderService.extractUsername(token));
    var signature =
        findByTokenSignAndUsername(token, user).orElseThrow(
            () -> new RuntimeException("not found!")).getTokenSign();
    if (!jwtDecoderService.isTokenValid(token, signature)) {
      throw new RuntimeException("invalid token");
    }
  }

  @Override
  public String extractUsername(String jwt) {
    return jwtDecoderService.extractUsername(jwt);
  }

  @Transactional
  @Override
  public void invalidateTokenSignatureByAuthorizationHeader(String authorizationHeader) {
    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
      return;
    }
    String jwt = authorizationHeader.substring(7);
    var signature = jwtDecoderService.extractTokenVersion(jwt);
    invalidateTokenSignature(signature);
  }
}
