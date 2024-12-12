package com.gucardev.springsecurityjwtexample.service.impl;


import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.mapper.UserMapper;
import com.gucardev.springsecurityjwtexample.repository.UserRepository;
import com.gucardev.springsecurityjwtexample.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
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
    return repository.findByUsernameAndIsEnabledTrue(username)
        .orElseThrow(() -> new EntityNotFoundException("User not found"));
  }

  @Override
  public UserDto getDtoByUsername(String username) {
    User user = getByUsername(username);
    return UserMapper.toDto(user);
  }

  @Override
  public User createUser(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return repository.save(user);
  }
}
