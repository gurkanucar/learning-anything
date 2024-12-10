package com.gucardev.mapstructexample.dto.request;

import com.gucardev.mapstructexample.dto.EmployeeDto;
import java.util.List;
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
