package com.gucardev.springsecurityjwtexample.controller;

import com.gucardev.springsecurityjwtexample.dto.LoginRequest;
import com.gucardev.springsecurityjwtexample.dto.RefreshTokenRequest;
import com.gucardev.springsecurityjwtexample.dto.TokenDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok().body(authService.login(loginRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenDto> refresh(@RequestBody RefreshTokenRequest request) {
        TokenDto newTokens = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(newTokens);
    }

    @GetMapping("/get-myself")
    public ResponseEntity<UserDto> generateServiceToken() {
        return ResponseEntity.ok().body(authService.getAuthenticatedUser());
    }

}
