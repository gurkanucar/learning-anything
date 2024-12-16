package com.gucardev.mapstructexample.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentRequest {

  private String name;
  private Long headOfDepartmentId;
}
