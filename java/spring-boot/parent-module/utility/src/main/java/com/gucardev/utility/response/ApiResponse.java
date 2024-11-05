package com.gucardev.utility.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.text.SimpleDateFormat;
import java.util.Date;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "error",
        "status",
        "message",
        "payload",
        "time"
})
public class ApiResponse<T> {

    private final boolean isError = false;
    private final HttpStatus status;
    private final String message;
    private final T payload;

    @Builder.Default
    private final String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
}
