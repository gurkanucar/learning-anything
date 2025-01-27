package com.gucardev.springsecurityjwtexample.dto;

import com.gucardev.springsecurityjwtexample.entity.Role;
import com.gucardev.springsecurityjwtexample.entity.User;
import lombok.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenRequest {

    private String email;
    private Set<Role> roles;

    public Set<String> extractRolesAsStringSet() {
        return this.getRoles()
                .stream()
                .map(Role::name)
                .collect(Collectors.toSet());
    }

}
