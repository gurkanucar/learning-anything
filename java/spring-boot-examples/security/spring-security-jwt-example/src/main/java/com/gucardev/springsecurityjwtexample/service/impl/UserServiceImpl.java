package com.gucardev.springsecurityjwtexample.service.impl;


import static com.gucardev.springsecurityjwtexample.mapper.UserMapper.toDto;

import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.entity.Token;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.TokenRepository;
import com.gucardev.springsecurityjwtexample.repository.UserRepository;
import com.gucardev.springsecurityjwtexample.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final TokenRepository tokenRepository;
  @Value("${jwt-variables.expiration-time}")
  private long jwtExpiration;

  @Override
  public Optional<User> getById(Long id) {
    return repository.findById(id);
  }

  @Override
  public User getByUsername(String username) {
    var user = repository.findByUsernameAndIsEnabledTrue(username);
    if (user.isEmpty()) {
      throw new EntityNotFoundException("user not found!");
    }
    return user.get();
  }

  @Override
  public UserDto getDtoByUsername(String username) {

    // todo
    return toDto(getByUsername(username), null);
  }

  @Override
  public User createUser(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return repository.save(user);
  }

  @Override
  public String updateTokenSign(String username) {
    User user = getByUsername(username);
    var sign = UUID.randomUUID().toString();

    // Create a new Token entity
    Token tokenEntity = new Token();
    tokenEntity.setTokenSign(sign);
    tokenEntity.setUser(user);
    tokenEntity.setExpiration(new Date(System.currentTimeMillis() + jwtExpiration));
    tokenRepository.save(tokenEntity);
    repository.save(user);
    return sign;
  }

  @Transactional
  @Override
  public void invalidateToken(String sign) {
    tokenRepository.deleteByTokenSign(sign);
  }

}
