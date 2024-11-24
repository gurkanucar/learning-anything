package com.gucardev.springsecurityjwtexample.service.impl;

import static com.gucardev.springsecurityjwtexample.mapper.UserMapper.toDto;

import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.security.CustomUsernamePasswordAuthenticationToken;
import com.gucardev.springsecurityjwtexample.service.AuthService;
import com.gucardev.springsecurityjwtexample.service.JwtDecoderService;
import com.gucardev.springsecurityjwtexample.service.JwtEncoderService;
import com.gucardev.springsecurityjwtexample.service.TokenService;
import com.gucardev.springsecurityjwtexample.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final JwtEncoderService jwtEncoderService;
  private final JwtDecoderService jwtDecoderService;
  private final AuthenticationManager authenticationManager;
  private final UserService userService;
  private final TokenService tokenService;

  @Override
  public TokenDto login(LoginRequest loginRequest) {
    var authObj = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getUsername(), loginRequest.getPassword()));
    var token = jwtEncoderService.generateToken(authObj);
    var user = userService.getDtoByUsername(loginRequest.getUsername());
    return new TokenDto(token, user);
  }

  @Override
  public UserDto getAuthenticatedUser() {
    CustomUsernamePasswordAuthenticationToken jwtAuthentication;
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    jwtAuthentication = (CustomUsernamePasswordAuthenticationToken) authentication;
    var user = userService.getByUsername(jwtAuthentication.getName());
    String jwtToken = jwtAuthentication.getToken();
    return toDto(user, jwtToken);
  }

  @Override
  public void logout(String authorizationHeader) {
    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
      return;
    }
    String jwt = authorizationHeader.substring(7);
    var sign = jwtDecoderService.extractTokenVersion(jwt);
    // update token sign on logout
    tokenService.invalidateTokenSignature(sign);
  }

}
