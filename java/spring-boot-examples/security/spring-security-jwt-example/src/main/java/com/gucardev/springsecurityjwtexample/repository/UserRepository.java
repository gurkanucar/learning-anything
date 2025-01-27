package com.gucardev.springsecurityjwtexample.repository;

import com.gucardev.springsecurityjwtexample.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User>  findByEmailAndIsEnabledTrue(String email);
}
