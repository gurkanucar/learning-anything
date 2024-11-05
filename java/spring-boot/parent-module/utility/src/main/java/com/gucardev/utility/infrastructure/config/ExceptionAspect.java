package com.gucardev.utility.infrastructure.config;

import com.gucardev.utility.infrastructure.exception.model.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class ExceptionAspect {

    private static final String TRACE_ID_LOG_VAR_NAME = "traceId";

    // if you have request filter you have to ignore them below using !within
    // ex: && !within(org.gucardev.utilities.security.JwtFilter)
    @AfterThrowing(
            pointcut = "execution(* com.gucardev.utility..*(..)) &&" +
                    " !within(com.gucardev.utility.exception..*)",
            throwing = "ex"
    )
    public void handleExceptions(JoinPoint joinPoint, Exception ex) {
        String traceId = MDC.get(TRACE_ID_LOG_VAR_NAME);
        String methodName = joinPoint.getSignature().toShortString();
        String arguments = Arrays.toString(joinPoint.getArgs());
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String logMessage = String.format(
                "exception:aspect || Trace ID: %s, Timestamp: %s, Method: %s, Arguments: %s, Exception: %s",
                traceId, timestamp, methodName, arguments, ex.getMessage());

        if (isCustomException(ex)) {
            log.warn(logMessage);
        } else {
            log.error(logMessage, ex);
        }
    }

    private boolean isCustomException(Exception ex) {
        return ex instanceof CustomException;
    }
}
