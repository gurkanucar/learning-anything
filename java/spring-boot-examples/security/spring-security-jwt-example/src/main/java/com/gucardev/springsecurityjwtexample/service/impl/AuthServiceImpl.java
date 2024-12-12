package com.gucardev.springsecurityjwtexample.service.impl;

import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.OtpValidateRequest;
import com.gucardev.springsecurityjwtexample.dto.RefreshTokenRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.mapper.UserMapper;
import com.gucardev.springsecurityjwtexample.security.CustomUserDetails;
import com.gucardev.springsecurityjwtexample.service.AuthService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final AuthenticationManager authenticationManager;
  private final TokenService tokenService;

  @Override
  public TokenDto login(LoginRequest loginRequest) {
    try {
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(
              loginRequest.getUsername(),
              loginRequest.getPassword())
      );
      CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
      User user = userDetails.getUser();
      var token = tokenService.createNewTokenForUser(user);

      if (Boolean.TRUE.equals(user.getOtpEnabled())) {
        var otpCode = tokenService.createOtp(token.getTokenSign());
        log.info("otp: {}, created for user {}", otpCode, loginRequest.getUsername());
      }
      return token;
    } catch (Exception e) {
      log.error("Error occurred during login for user: {}", loginRequest.getUsername(), e);
      throw new RuntimeException("Error occurred during login");
    }
  }

  @Override
  public UserDto getAuthenticatedUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated()) {
      CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
      return UserMapper.toDto(userDetails.getUser());
    }
    throw new IllegalStateException("No authenticated user found");
  }

  @Override
  public void logout(String authorizationHeader) {
    tokenService.invalidateTokenByAuthorizationHeader(authorizationHeader);
  }

  @Override
  public TokenDto refreshToken(RefreshTokenRequest refreshTokenRequest) {
    return tokenService.createNewTokenWithRefreshToken(refreshTokenRequest.getRefreshToken());
  }

  @Override
  public boolean validateOtp(OtpValidateRequest otpValidateRequest) {
    return tokenService.isOtpValid(otpValidateRequest);
  }
}
