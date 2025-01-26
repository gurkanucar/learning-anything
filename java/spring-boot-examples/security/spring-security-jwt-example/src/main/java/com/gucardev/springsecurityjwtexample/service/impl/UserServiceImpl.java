package com.gucardev.springsecurityjwtexample.service.impl;


import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.repository.UserRepository;
import com.gucardev.springsecurityjwtexample.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User getByUsername(String username) {
        return repository.findByUsernameAndIsEnabledTrue(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found for username: " + username));
    }

    @Override
    public void createUser(User user) {
        user.setPassword(encodePassword(user.getPassword()));
        repository.save(user);
    }

    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}
