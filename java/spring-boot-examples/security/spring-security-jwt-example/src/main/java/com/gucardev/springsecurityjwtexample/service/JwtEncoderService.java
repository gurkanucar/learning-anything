package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.entity.User;
import java.util.List;
import org.springframework.security.core.Authentication;

public interface JwtEncoderService {

  String generateToken(String username, List<String> roles, String tokenSign);
}