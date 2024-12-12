package com.gucardev.springsecurityjwtexample.repository;

import com.gucardev.springsecurityjwtexample.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByUsernameAndIsEnabledTrue(String username);
}
