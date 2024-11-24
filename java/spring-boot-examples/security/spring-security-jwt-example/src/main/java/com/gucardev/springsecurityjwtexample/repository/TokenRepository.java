package com.gucardev.springsecurityjwtexample.repository;

import com.gucardev.springsecurityjwtexample.entity.Token;
import com.gucardev.springsecurityjwtexample.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

  Optional<Token> findByTokenSignAndUser(String tokenSign, User user);
  Optional<Token> findByTokenSignAndUserName(String tokenSign, String user);

  void deleteByTokenSign(String tokenSign);
}
