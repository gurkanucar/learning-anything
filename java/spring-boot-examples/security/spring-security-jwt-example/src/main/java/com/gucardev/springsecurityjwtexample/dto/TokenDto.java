package com.gucardev.springsecurityjwtexample.dto;

import com.gucardev.springsecurityjwtexample.entity.User;
import com.gucardev.springsecurityjwtexample.mapper.UserMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenDto {

    private String accessToken;
    private String refreshToken;
    private UserDto user;

    public static TokenDto buildTokenDto(User user, String accessToken, String refreshToken) {
        return TokenDto.builder()
                .user(UserMapper.toDto(user))
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

}
