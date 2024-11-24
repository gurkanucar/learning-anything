package com.gucardev.springsecurityjwtexample.mapper;


import com.gucardev.springsecurityjwtexample.dto.UserDto;
import com.gucardev.springsecurityjwtexample.dto.UserDto.RoleDto;
import com.gucardev.springsecurityjwtexample.entity.User;

public class UserMapper {

  public static UserDto toDto(User entity) {
    var dto = new UserDto();
    dto.setId(entity.getId());
    dto.setUsername(entity.getUsername());
    dto.setEmail(entity.getEmail());
    dto.setRole(new RoleDto(entity.getRole().name()));
    return dto;
  }

}
