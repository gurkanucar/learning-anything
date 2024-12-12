package com.gucardev.utility.infrastructure.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.gucardev.utility.infrastructure.config.MessageUtil;
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

    private final boolean isError;
    private final HttpStatus status;
    private final String message;
    private final T payload;
    private final String time;

    public ApiResponse(boolean isError, HttpStatus status, String messageKey, T payload, String time) {
        this.isError = isError;
        this.status = status;
        this.message = messageKey != null ? MessageUtil.getMessage(messageKey) : MessageUtil.getMessage("messages.default.success");
        this.payload = payload;
        this.time = time != null ? time : new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }
}
