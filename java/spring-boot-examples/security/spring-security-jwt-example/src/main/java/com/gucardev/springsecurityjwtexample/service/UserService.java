package com.gucardev.springsecurityjwtexample.service;

import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.entity.User;
import java.util.Optional;

public interface UserService {

  Optional<User> getById(Long id);

  User getByUsername(String username);

  UserDto getDtoByUsername(String username);

  User createUser(User user);

}
