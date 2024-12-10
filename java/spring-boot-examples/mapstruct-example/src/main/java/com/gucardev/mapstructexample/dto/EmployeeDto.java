package com.gucardev.mapstructexample.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeDto {
  private Long id;
  private String firstName;
  private String lastName;
  private String fullName;
  private DepartmentDto department;
  private List<ProjectDto> projects;
}
