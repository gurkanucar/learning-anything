package com.gucardev.utility.infrastructure.config;

import com.gucardev.utility.UtilityApplication;
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
public class AopExceptionHandler {

  @Pointcut("within(com.gucardev.utility..*) && " +
      "(within(@org.springframework.stereotype.Component *) || " +
      "within(@org.springframework.stereotype.Service *) || " +
      "within(@org.springframework.stereotype.Repository *) || " +
      "within(@org.springframework.stereotype.Controller *))" +
      " && !@within(com.gucardev.utility.infrastructure.annotation.ExcludeFromAspect)")
  public void applicationPackagePointcut() {
  }

  @AfterThrowing(pointcut = "applicationPackagePointcut()", throwing = "e")
  public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
    Logger logger = LoggerFactory.getLogger(joinPoint.getSignature().getDeclaringTypeName());

    StackTraceElement[] stackTrace = e.getStackTrace();
    StackTraceElement rootCauseElement = stackTrace.length > 0 ? stackTrace[0] : null;
    String locationDetails = rootCauseElement != null
        ? String.format("%s:%d", rootCauseElement.getFileName(), rootCauseElement.getLineNumber())
        : "Unknown location";

    logger.error(
        "Exception in method '{}' [Class: '{}', Location: '{}'] with cause: '{}' | exception message: '{}' | root cause message: '{}'",
        joinPoint.getSignature().getName(),
        joinPoint.getSignature().getDeclaringTypeName(),
        locationDetails,
        e.getCause() != null ? e.getCause().toString() : "NULL",
        e.getMessage(),
        ExceptionUtils.getRootCauseMessage(e)
    );
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
    StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
    for (StackTraceElement element : stackTrace) {
      if (element.getClassName().contains(UtilityApplication.getMainPackageName())) {
        return String.format("%s:%d", element.getFileName(), element.getLineNumber());
      }
    }
    return "Unknown location";
  }
}