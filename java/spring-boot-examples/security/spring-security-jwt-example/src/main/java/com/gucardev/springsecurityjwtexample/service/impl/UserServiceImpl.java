package com.gucardev.springsecurityjwtexample.service.impl;


import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.UserRepository;
import com.gucardev.springsecurityjwtexample.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> getByEmail(String email) {
        return repository.findByEmailAndIsEnabledTrue(email);
    }

    @Override
    public void createUser(User user) {
        user.setPassword(encodePassword(user.getPassword()));
        repository.save(user);
    }

    @Override
    public void upsertForOauth(User user) {
        if (user.getId() == null) {
            user.setIsEnabled(true);
            repository.save(user);
        }
    }

    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}
