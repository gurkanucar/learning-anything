package com.gucardev.mapstructexample.dto.request;

import com.gucardev.mapstructexample.dto.DepartmentDto;
import com.gucardev.mapstructexample.dto.EmployeeDto;
import com.gucardev.mapstructexample.dto.ProjectDto;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeRequest {
  private Long id;
  private String firstName;
  private String lastName;
  private Long departmentId;
}
