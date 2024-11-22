package com.gucardev.utility.infrastructure.config;

import java.util.Arrays;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

  @Pointcut("within(com.gucardev.utility..*)")
  public void applicationPackagePointcut() {
  }

  @AfterThrowing(pointcut = "applicationPackagePointcut()", throwing = "e")
  public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
    Logger logger = LoggerFactory.getLogger(joinPoint.getSignature().getDeclaringTypeName());

    // Extracting details from the stack trace
    StackTraceElement[] stackTrace = e.getStackTrace();
    StackTraceElement rootCauseElement = stackTrace.length > 0 ? stackTrace[0] : null;
    String locationDetails = rootCauseElement != null
        ? String.format("%s:%d", rootCauseElement.getFileName(), rootCauseElement.getLineNumber())
        : "Unknown location";

    // Log the error with additional details
    logger.error(
        "Exception in method '{}' [Class: '{}', Location: '{}'] with cause: '{}' | exception message: '{}' | root cause message: '{}'",
        joinPoint.getSignature().getName(),
        joinPoint.getSignature().getDeclaringTypeName(),
        locationDetails,
        e.getCause() != null ? e.getCause().toString() : "NULL",
        e.getMessage(),
        ExceptionUtils.getRootCauseMessage(e)
    );

    // Optionally log the full stack trace for debugging purposes
    if (logger.isDebugEnabled()) {
      logger.debug("Full stack trace: ", e);
    }
  }

  @Around("applicationPackagePointcut()")
  public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
    Logger logger = LoggerFactory.getLogger(joinPoint.getSignature().getDeclaringTypeName());

    if (logger.isDebugEnabled()) {
      logger.debug("Enter: {}() [Class: '{}', Line: '{}'] with arguments = {}",
          joinPoint.getSignature().getName(),
          joinPoint.getSignature().getDeclaringTypeName(),
          getLineNumber(),
          Arrays.toString(joinPoint.getArgs()));
    }

    Object result = joinPoint.proceed();

    if (logger.isDebugEnabled()) {
      logger.debug("Exit: {}() with result = {}", joinPoint.getSignature().getName(), result);
    }
    return result;
  }

  private String getLineNumber() {
    // Capture the stack trace element for the current join point
    StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
    for (StackTraceElement element : stackTrace) {
      if (element.getClassName().contains("com.gucardev.utility")) {
        return String.format("%s:%d", element.getFileName(), element.getLineNumber());
      }
    }
    return "Unknown location";
  }
}
