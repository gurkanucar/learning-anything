package com.gucardev.mapstructexample.dto.request;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class ProjectRequest {

  private Long id;
  private String projectName;
}
