package com.gucardev.mapstructexample.dto.request;

import com.gucardev.mapstructexample.dto.EmployeeDto;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentRequest {
  private Long id;
  private String name;
  private Long headOfDepartmentId;
}
