package com.gucardev.springsecurityjwtexample.repository;

import com.gucardev.springsecurityjwtexample.entity.Token;
import com.gucardev.springsecurityjwtexample.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

  void deleteByTokenSign(String tokenSign);

  Optional<Token> findByTokenSignAndUser_Username(String tokenSign, String username);

  int countByUser(User user);

  @Query("SELECT t FROM Token t WHERE t.user = :user ORDER BY t.createdDateTime ASC")
  List<Token> findOldestTokenByUser(@Param("user") User user);

}
