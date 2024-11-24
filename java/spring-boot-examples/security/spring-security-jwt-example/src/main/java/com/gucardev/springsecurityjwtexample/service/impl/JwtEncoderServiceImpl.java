package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.security.CustomUserDetails;
import com.gucardev.springsecurityjwtexample.service.JwtEncoderService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import com.gucardev.springsecurityjwtexample.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class JwtEncoderServiceImpl implements JwtEncoderService {

  private final Key signInKey;
  private final long jwtExpiration;
  private final UserService userService;
  private final TokenService  tokenService;

  public JwtEncoderServiceImpl(
      @Value("${jwt-variables.secret-key}") String secretKey,
      @Value("${jwt-variables.expiration-time}") long jwtExpiration,
      UserService userService, TokenService tokenService
  ) {
    this.signInKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    this.jwtExpiration = jwtExpiration;
    this.userService = userService;
    this.tokenService = tokenService;
  }

  @Override
  public String generateToken(Authentication authentication) {
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    User user = userDetails.getUser();

    // Generate a unique tokenSign (e.g., UUID)
    String tokenSign = tokenService.createNewTokenSignatureForUser(user);

    // Include tokenSign in JWT claims
    Map<String, Object> claims = new HashMap<>();
    claims.put("roles", userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList()));
    claims.put("tokenSign", tokenSign);

    return buildToken(claims, user.getUsername(), jwtExpiration);
  }

  private String buildToken(Map<String, Object> claims, String username, long expiration) {
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(signInKey, SignatureAlgorithm.HS256)
        .compact();
  }
}

