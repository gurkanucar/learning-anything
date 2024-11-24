package com.gucardev.springsecurityjwtexample.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.UUID;
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

    private Role role;

    private UUID tokenSign;

    private transient String token;

}
