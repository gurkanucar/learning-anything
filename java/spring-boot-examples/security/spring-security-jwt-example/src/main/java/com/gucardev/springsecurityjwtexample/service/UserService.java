package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.entity.User;

import java.util.Optional;

public interface UserService {
    Optional<User> getByEmail(String email);
    void createUser(User user);
    void upsertForOauth(User user);
}
