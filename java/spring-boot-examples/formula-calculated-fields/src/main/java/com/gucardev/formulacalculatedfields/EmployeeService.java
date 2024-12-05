package com.gucardev.formulacalculatedfields;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

  private final EmployeeRepository employeeRepository;

  public EmployeeService(EmployeeRepository employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  public List<Employee> getAllEmployees() {
    return employeeRepository.findAll();
  }

  public Employee saveEmployee(Employee employee) {
    return employeeRepository.save(employee);
  }

  public List<Employee> searchAndSortEmployees(String searchTerm, String sortBy, String sortDir) {
    Specification<Employee> spec = EmployeeSpecifications.searchByFullName(searchTerm);
    Sort.Direction direction;
    try {
      direction = Sort.Direction.fromString(sortDir);
    } catch (IllegalArgumentException e) {
      direction = Sort.Direction.ASC;
    }
    if (!sortBy.equals("fullName") && !sortBy.equals("age")) {
      sortBy = "fullName";
    }
    Sort sort = Sort.by(direction, sortBy);
    return employeeRepository.findAll(spec, sort);
  }

}
