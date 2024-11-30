package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.entity.User;


public interface TokenService {

  TokenDto createNewTokenForUser(User user);

  TokenDto createNewTokenWithRefreshToken(String refreshToken);

  void invalidateTokenSignature(String signature);

  String validateTokenAndReturnUsername(String token);

  void invalidateTokenByAuthorizationHeader(String authorizationHeader);
}