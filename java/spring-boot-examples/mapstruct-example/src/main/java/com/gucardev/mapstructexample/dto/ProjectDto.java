package com.gucardev.mapstructexample.dto;

import java.util.Set;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class ProjectDto {

  private Long id;
  private String projectName;
  private Set<EmployeeDto> assignedEmployees;
  private Set<Long> assignedEmployeesIdList;
}
