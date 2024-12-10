package com.gucardev.mapstructexample.dto.request;

import com.gucardev.mapstructexample.dto.EmployeeDto;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectRequest {
  private Long id;
  private String projectName;
}
