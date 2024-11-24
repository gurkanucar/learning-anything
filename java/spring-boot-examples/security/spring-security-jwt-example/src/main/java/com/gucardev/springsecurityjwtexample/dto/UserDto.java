package com.gucardev.springsecurityjwtexample.dto;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(NON_NULL)
public class UserDto extends BaseDto {

  private String username;
  private String email;
  private RoleDto role;
  private String token;
  private boolean isEnabled;

  @NoArgsConstructor
  @AllArgsConstructor
  @Getter
  @Setter
  public static class RoleDto {

    private String name;
  }
}
