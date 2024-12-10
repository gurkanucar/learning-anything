package com.gucardev.mapstructexample.dto.request;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class DepartmentRequest {

  private Long id;
  private String name;
  private Long headOfDepartmentId;
}
