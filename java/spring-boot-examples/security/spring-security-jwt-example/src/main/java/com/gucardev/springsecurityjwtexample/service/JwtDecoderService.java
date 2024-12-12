package com.gucardev.springsecurityjwtexample.service;

import io.jsonwebtoken.Claims;
import java.util.List;
import java.util.function.Function;

public interface JwtDecoderService {

  String extractUsername(String token);

  List<String> extractRoles(String token);

  String extractTokenSign(String token);

  <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

  boolean isTokenExpired(String token);

  boolean isTokenValid(String token, String expectedSignature);
}
