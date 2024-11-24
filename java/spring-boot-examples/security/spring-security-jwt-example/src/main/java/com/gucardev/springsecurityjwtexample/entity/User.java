package com.gucardev.springsecurityjwtexample.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "USERS")
@Getter
@Setter
public class User extends BaseEntity {

  private String name;

  @Column(nullable = false)
  private String username;

  @Column(nullable = false)
  private String password;

  private String email;

  private Boolean isEnabled;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
  @Enumerated(EnumType.STRING)
  @Column(name = "role")
  private Set<Role> roles = new HashSet<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.MERGE, orphanRemoval = true)
  private Set<Token> tokens = new HashSet<>();

}
