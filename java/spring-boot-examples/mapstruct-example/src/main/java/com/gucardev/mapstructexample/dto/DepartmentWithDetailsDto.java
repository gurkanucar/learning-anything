package com.gucardev.mapstructexample.dto;

import java.util.List;
import java.util.Set;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class DepartmentWithDetailsDto {

  private Long id;
  private String name;
  private EmployeeDto headOfDepartment;
  private Long headOfDepartmentId;
  private List<EmployeeDto> employees;

  @Getter
  @Setter
  public static class EmployeeDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private Set<ProjectDto> projects;
  }

  @Getter
  @Setter
  public static class ProjectDto {

    private Long id;
    private String projectName;
  }
}


