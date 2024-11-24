package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.entity.Token;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.TokenRepository;
import com.gucardev.springsecurityjwtexample.security.CustomUserDetails;
import com.gucardev.springsecurityjwtexample.service.JwtDecoderService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


@Service
public class JwtDecoderServiceImpl implements JwtDecoderService {

  private final Key signInKey;
  private final TokenService tokenService;

  public JwtDecoderServiceImpl(@Value("${jwt-variables.secret-key}") String secretKey,
      TokenService tokenService) {
    this.signInKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    this.tokenService = tokenService;
  }

  @Override
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  @Override
  public List<String> extractRoles(String token) {
    return extractClaim(token, claims -> claims.get("roles", List.class));
  }

  @Override
  public String extractTokenVersion(String token) {
    return extractClaim(token, claims -> claims.get("tokenSign", String.class));
  }

  @Override
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  @Override
  public boolean isTokenExpired(String token) {
    Date expiration = extractClaim(token, Claims::getExpiration);
    return expiration.before(new Date());
  }

  @Override
  public boolean isTokenValid(String token, UserDetails userDetails) {
    String tokenSign = extractTokenSign(token);
    User user = ((CustomUserDetails) userDetails).getUser();

    // Check if the tokenSign exists and is valid
    Optional<Token> tokenEntityOpt = tokenService.findByTokenSignAndUsername(tokenSign, user);
    return tokenEntityOpt.isPresent() && !isTokenExpired(token);
  }

  private String extractTokenSign(String token) {
    return extractClaim(token, claims -> claims.get("tokenSign", String.class));
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(signInKey)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}
