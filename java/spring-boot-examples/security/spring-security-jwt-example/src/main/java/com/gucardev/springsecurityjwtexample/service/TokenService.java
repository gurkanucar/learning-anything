package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.entity.User;


public interface TokenService {

  String createNewTokenSignatureForUser(User user);

  void invalidateTokenSignature(String signature);

  void validateToken(String token);

  void invalidateTokenByAuthorizationHeader(String authorizationHeader);
}