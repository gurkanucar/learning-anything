package com.gucardev.springsecurityjwtexample.service;

import org.springframework.security.core.Authentication;

public interface JwtEncoderService {

    String generateToken(Authentication authentication);

}
