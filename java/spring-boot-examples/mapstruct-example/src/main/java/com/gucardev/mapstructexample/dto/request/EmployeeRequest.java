package com.gucardev.mapstructexample.dto.request;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class EmployeeRequest {

  private Long id;
  private String firstName;
  private String lastName;
  private Long departmentId;
}
