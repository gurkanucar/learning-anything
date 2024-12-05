package com.gucardev.formulacalculatedfields;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

  private final EmployeeService employeeService;

  public EmployeeController(EmployeeService employeeService) {
    this.employeeService = employeeService;
  }

  @GetMapping
  public List<Employee> getAllEmployees() {
    return employeeService.getAllEmployees();
  }

  @GetMapping("/employees/search")
  public List<Employee> searchEmployees(
      @RequestParam String searchTerm,
      @RequestParam String sortBy,
      @RequestParam String sortDir) {
    return employeeService.searchAndSortEmployees(searchTerm, sortBy, sortDir);
  }

  @PostMapping
  public Employee saveEmployee(@RequestBody Employee employee) {
    return employeeService.saveEmployee(employee);
  }
}
