package com.gucardev.utility.domain.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanWrapperImpl;

import java.util.Arrays;
import java.util.Objects;

public class OneNotNullValidator implements ConstraintValidator<OneNotNull, Object> {
  private String[] fields;

  @Override
  public void initialize(final OneNotNull combinedNotNull) {
    fields = combinedNotNull.fields();
  }

  @Override
  public boolean isValid(final Object obj, final ConstraintValidatorContext context) {
    final BeanWrapperImpl beanWrapper = new BeanWrapperImpl(obj);

    boolean valid =
        Arrays.stream(fields)
            .map(beanWrapper::getPropertyValue)
            .anyMatch(x -> Objects.nonNull(x) && !StringUtils.isEmpty(x.toString()));

    if (!valid) {
      context.disableDefaultConstraintViolation();
      context
          .buildConstraintViolationWithTemplate(
              String.format("One of the fields %s must be set", Arrays.toString(fields)))
          .addConstraintViolation();
    }

    return valid;
  }
}
