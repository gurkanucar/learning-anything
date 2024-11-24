package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.entity.Token;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.TokenRepository;
import com.gucardev.springsecurityjwtexample.service.TokenService;
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
}
