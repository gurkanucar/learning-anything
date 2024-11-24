package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.service.JwtEncoderService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class JwtEncoderServiceImpl implements JwtEncoderService {

    private final Key signInKey;
    private final long jwtExpiration;

    public JwtEncoderServiceImpl(
        @Value("${jwt-variables.secret-key}") String secretKey,
        @Value("${jwt-variables.expiration-time}") long jwtExpiration) {
        this.signInKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        this.jwtExpiration = jwtExpiration;
    }

    @Override
    public String generateToken(Authentication authentication, UUID tokenSign) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", authentication.getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList()));
        claims.put("tokenSign", tokenSign.toString());
        return buildToken(claims, authentication.getName(), jwtExpiration);
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

