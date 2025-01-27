package com.gucardev.springsecurityjwtexample.service.impl;


import com.gucardev.springsecurityjwtexample.service.JwtTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
public class JwtTokenServiceImpl implements JwtTokenService {

    private final Key signingKey;
    private final long jwtTokenExpiresInMinutes;

    public JwtTokenServiceImpl(
            @Value("${jwt-variables.secret-key}") String secretKey,
            @Value("${jwt-variables.expiration-time}") long jwtTokenExpiresInMinutes
    ) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        this.jwtTokenExpiresInMinutes = jwtTokenExpiresInMinutes;
    }

    @Override
    public String generateToken(String username, Set<String> roles) {
        Date expiryDate = Date.from(Instant.now().plus(jwtTokenExpiresInMinutes, ChronoUnit.MINUTES));
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }

    @Override
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    @SuppressWarnings("unchecked")
    public Set<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return (Set<String>) claims.get("roles");
    }
}


