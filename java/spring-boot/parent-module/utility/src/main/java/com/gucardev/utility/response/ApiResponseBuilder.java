package com.gucardev.utility.response;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApiResponseBuilder {

    private final MessageSource messageSource;

    public <T> ApiResponse<T> buildResponse(HttpStatus status, T data, String messageKey) {
        String localizedMessage = messageSource.getMessage(
                messageKey,
                null,
                LocaleContextHolder.getLocale()
        );

        return ApiResponse.<T>builder()
                .status(status)
                .message(localizedMessage)
                .payload(data)
                .build();
    }
}
