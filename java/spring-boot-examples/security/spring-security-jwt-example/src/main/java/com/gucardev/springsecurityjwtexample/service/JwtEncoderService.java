package com.gucardev.springsecurityjwtexample.service;

import java.util.List;

public interface JwtEncoderService {

  String generateToken(String username, List<String> roles, String tokenSign);
}