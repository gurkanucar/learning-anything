package com.gucardev.mapstructexample.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentDto {
  private Long id;
  private String name;
  private EmployeeDto headOfDepartment;
  private List<EmployeeDto> employees;
}


