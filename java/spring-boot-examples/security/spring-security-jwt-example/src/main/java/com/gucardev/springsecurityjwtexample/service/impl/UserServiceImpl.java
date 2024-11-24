package com.gucardev.springsecurityjwtexample.service.impl;


import static com.gucardev.springsecurityjwtexample.mapper.UserMapper.toDto;

import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.UserRepository;
import com.gucardev.springsecurityjwtexample.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import java.util.UUID;
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
        return toDto(getByUsername(username));
    }

    @Override
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }

    @Override
    public UUID updateTokenSign(String username) {
        User user = getByUsername(username);
        var sign = UUID.randomUUID();
        user.setTokenSign(sign);
        repository.save(user);
        return sign;
    }

    @Override
    public User validateAndReturnService(String username, String password) {
        var service = getByUsername(username);
        if (!passwordEncoder.matches(password, service.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return service;
    }

}
