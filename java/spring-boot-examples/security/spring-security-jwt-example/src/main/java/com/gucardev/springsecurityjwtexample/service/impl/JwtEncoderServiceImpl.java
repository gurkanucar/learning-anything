package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.service.JwtEncoderService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtEncoderServiceImpl implements JwtEncoderService {

  private final Key signingKey;
  private final long jwtExpiration;

  public JwtEncoderServiceImpl(
      @Value("${jwt-variables.secret-key}") String secretKey,
      @Value("${jwt-variables.expiration-time}") long jwtExpiration
  ) {
    this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    this.jwtExpiration = jwtExpiration;
  }

  @Override
  public String generateToken(String username, List<String> roles, String tokenSign) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("roles", roles);
    claims.put("tokenSign", tokenSign);
    return buildToken(claims, username);
  }

  private String buildToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }
}


