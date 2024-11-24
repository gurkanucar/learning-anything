package com.gucardev.springsecurityjwtexample.service.impl;


import static com.gucardev.springsecurityjwtexample.mapper.UserMapper.toDto;

import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.UserRepository;
import com.gucardev.springsecurityjwtexample.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository repository;
  private final PasswordEncoder passwordEncoder;

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

}
