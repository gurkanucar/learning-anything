package com.gucardev.mapstructexample.controller;


import com.gucardev.mapstructexample.dto.EmployeeDto;
import com.gucardev.mapstructexample.dto.request.EmployeeRequest;
import com.gucardev.mapstructexample.service.EmployeeService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

  private final EmployeeService employeeService;

  @GetMapping
  public List<EmployeeDto> getAllEmployees() {
    return employeeService.getAllEmployees();
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
