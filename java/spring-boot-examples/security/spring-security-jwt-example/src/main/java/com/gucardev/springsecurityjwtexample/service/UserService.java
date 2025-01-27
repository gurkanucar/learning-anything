package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.entity.User;

public interface UserService {
    User getByUsername(String username);
    User getByEmail(String email);
    void createUser(User user);
}
