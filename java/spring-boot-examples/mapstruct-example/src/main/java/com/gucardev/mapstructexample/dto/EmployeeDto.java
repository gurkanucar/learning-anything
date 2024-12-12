package com.gucardev.mapstructexample.dto;

import java.util.Set;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class EmployeeDto {

  private Long id;
  private String firstName;
  private String lastName;
  private String fullName;
  private DepartmentDto department;
  private Long departmentId;
  private Long headOfDepartmentId;
  private Set<ProjectDto> projects;
}
