package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.entity.Token;
import com.gucardev.springsecurityjwtexample.entity.User;
import java.util.Optional;

public interface TokenService {

  String createNewTokenSignatureForUser(User user);

  void invalidateTokenSignature(String signature);

  Optional<Token> findByTokenSignAndUsername(String tokenSign, User user);

  void validateToken(String token);

  String extractUsername(String jwt);

  void invalidateTokenSignatureByAuthorizationHeader(String authorizationHeader);
}
