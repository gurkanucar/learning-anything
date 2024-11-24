package com.gucardev.springsecurityjwtexample.service;

import io.jsonwebtoken.Claims;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtDecoderService {

  String extractUsername(String token);

  List<String> extractRoles(String token);

  <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

  boolean isTokenExpired(String token);

  String extractTokenVersion(String token);

  boolean isTokenValid(String token, UserDetails userDetails);

}
