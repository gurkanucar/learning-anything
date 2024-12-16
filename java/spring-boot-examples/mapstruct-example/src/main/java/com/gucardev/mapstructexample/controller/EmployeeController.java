package com.gucardev.mapstructexample.controller;


import com.gucardev.mapstructexample.dto.EmployeeDto;
import com.gucardev.mapstructexample.dto.request.EmployeeRequest;
import com.gucardev.mapstructexample.dto.request.EmployeeSearchRequest;
import com.gucardev.mapstructexample.service.EmployeeService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

  private final EmployeeService employeeService;

  @GetMapping
  public Page<EmployeeDto> searchEmployees(EmployeeSearchRequest searchRequest) {
    return employeeService.searchEmployees(searchRequest);
  }
  @GetMapping("department/{departmentId}")
  public List<EmployeeDto> getAllEmployees(@PathVariable Long departmentId) {
    return employeeService.getAllEmployeesByDepartmentId(departmentId);
  }

  @GetMapping("/{id}")
  public EmployeeDto getEmployeeById(@PathVariable Long id) {
    return employeeService.getEmployeeByIdDto(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public EmployeeDto createEmployee(@RequestBody EmployeeRequest request) {
    return employeeService.createEmployee(request);
  }

  @PutMapping("/{id}")
  public EmployeeDto updateEmployee(@PathVariable Long id,
      @RequestBody EmployeeRequest request) {
    return employeeService.updateEmployee(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteEmployee(@PathVariable Long id) {
    employeeService.deleteEmployee(id);
  }

  @PostMapping("/{employeeId}/projects/{projectId}")
  public EmployeeDto addProjectToEmployee(@PathVariable Long employeeId,
      @PathVariable Long projectId) {
    return employeeService.addProjectToEmployee(employeeId, projectId);
  }

  @DeleteMapping("/{employeeId}/projects/{projectId}")
  public EmployeeDto removeProjectFromEmployee(@PathVariable Long employeeId,
      @PathVariable Long projectId) {
    return employeeService.removeProjectFromEmployee(employeeId, projectId);
  }

}
