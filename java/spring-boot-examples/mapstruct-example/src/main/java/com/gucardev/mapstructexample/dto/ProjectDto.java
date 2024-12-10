package com.gucardev.mapstructexample.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectDto {
  private Long id;
  private String projectName;
  private List<EmployeeDto> assignedEmployees;
}
