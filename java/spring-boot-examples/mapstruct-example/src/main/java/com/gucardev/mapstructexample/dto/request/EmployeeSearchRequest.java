package com.gucardev.mapstructexample.dto.request;

import com.gucardev.mapstructexample.enumeration.StatusType;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Sort;

// EmployeeSearchRequest.java
@Getter
@Setter
public class EmployeeSearchRequest {
  private String searchParam;
  private String firstName;
  private String lastName;
  private String email;
  private Integer age;
  private LocalDate hireDateStart;
  private LocalDate hireDateEnd;
  private StatusType statusType;
  private Long departmentId;
  private Integer page = 0;
  private Integer pageSize = 10;
  private String sortBy = "id";
  private Sort.Direction sortOrder = Sort.Direction.ASC;
}