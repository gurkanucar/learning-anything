package com.gucardev.springsecurityjwtexample.config;

import com.gucardev.springsecurityjwtexample.entity.Role;
import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.service.UserService;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitialDataPopulate implements CommandLineRunner {

  private final UserService userService;

  @Override
  public void run(String... args) {

    var user = new User();
    user.setUsername("admin");
    user.setPassword("pass");
    user.setRoles(Set.of(Role.ADMIN, Role.USER));
    user.setIsEnabled(true);
    user = userService.createUser(user);

    var user2 = new User();
    user2.setUsername("user");
    user2.setPassword("pass");
    user2.setRoles(Set.of(Role.USER));
    user2.setIsEnabled(true);
    user2 = userService.createUser(user2);

  }

}
