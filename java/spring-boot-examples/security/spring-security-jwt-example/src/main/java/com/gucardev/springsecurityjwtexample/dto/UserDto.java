package com.gucardev.springsecurityjwtexample.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Getter
@Setter
@JsonInclude(NON_NULL)
public class UserDto extends BaseDto {

    private String username;
    private String email;
    private List<String> roles = new ArrayList<>();

}
