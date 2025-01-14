package com.gucardev.mapstructexample.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class DepartmentDto {

  private Long id;
  private String name;
  private EmployeeDto headOfDepartment;
  private Long headOfDepartmentId;
  private List<EmployeeDto> employees = new ArrayList<>();
}


