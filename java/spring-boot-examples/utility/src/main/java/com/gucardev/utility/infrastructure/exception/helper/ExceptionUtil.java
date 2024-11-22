package com.gucardev.utility.infrastructure.exception.helper;

import com.gucardev.utility.infrastructure.config.MessageUtil;
import com.gucardev.utility.infrastructure.exception.ExceptionMessage;
import com.gucardev.utility.infrastructure.exception.model.CustomException;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.stereotype.Component;

@Component
public class ExceptionUtil {

    public ExceptionUtil() {
    }

    public static CustomException buildException() {
        return buildException(ExceptionMessage.DEFAULT_EXCEPTION);
    }

    public static CustomException buildException(String ex) {
        return new CustomException(ex, ExceptionMessage.DEFAULT_EXCEPTION.getStatus());
    }

    public static CustomException buildException(ExceptionMessage ex, Object... args) {
        String errorMessage =
                MessageUtil.getMessage(ex.getKey(), args);
        return new CustomException(errorMessage, ex.getStatus());
    }

    public static CustomException buildException(ExceptionMessage ex) {
        String errorMessage =
                MessageUtil.getMessage(ex.getKey());
        return new CustomException(errorMessage, ex.getStatus());
    }

}
