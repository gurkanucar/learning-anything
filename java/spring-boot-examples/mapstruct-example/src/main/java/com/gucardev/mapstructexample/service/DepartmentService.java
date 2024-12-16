package com.gucardev.mapstructexample.service;

import com.gucardev.mapstructexample.dto.DepartmentDto;
import com.gucardev.mapstructexample.dto.DepartmentWithDetailsDto;
import com.gucardev.mapstructexample.dto.request.DepartmentRequest;
import com.gucardev.mapstructexample.entity.Department;
import com.gucardev.mapstructexample.entity.Employee;
import com.gucardev.mapstructexample.mapper.DepartmentMapper;
import com.gucardev.mapstructexample.repository.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DepartmentService {

  private final DepartmentRepository departmentRepository;
  private final DepartmentMapper departmentMapper;
  private final EmployeeService employeeService;

  public List<DepartmentDto> getAllDepartments() {
    return departmentRepository.findAll()
        .stream()
        .map(departmentMapper::toSummaryDto)
        .toList();
  }

  public DepartmentWithDetailsDto getDepartmentByIdDto(Long id) {
    return departmentRepository.findById(id)
        .map(departmentMapper::toFullDto)
        .orElseThrow(() -> new EntityNotFoundException("Department not found"));
  }

  public DepartmentDto createDepartment(DepartmentRequest departmentRequest) {
    var entity = departmentMapper.toEntity(departmentRequest);
    var saved = departmentRepository.save(entity);
    return departmentMapper.toSummaryDto(saved);
  }

  public DepartmentDto updateDepartment(Long id, DepartmentRequest departmentRequest) {
    var existing = getDepartmentById(id);
    departmentMapper.partialUpdate(departmentRequest,
        existing); // MapStruct handles partial updates
    if (departmentRequest.getHeadOfDepartmentId() != null) {
      existing.setHeadOfDepartment(employeeService.getEmployeeById(
          departmentRequest.getHeadOfDepartmentId()));
    } else {
      existing.setHeadOfDepartment(null);
    }
    var updated = departmentRepository.save(existing);
    return departmentMapper.toSummaryDto(updated);
  }

  public void deleteDepartment(Long id) {
    var existing = getDepartmentById(id);
    departmentRepository.delete(existing);
  }

  public void addEmployeeToDepartment(Long departmentId, Long employeeId) {
    Department department = getDepartmentById(departmentId);
    Employee employee = employeeService.getEmployeeById(employeeId);
    // If the employee is already in this department, return early
    if (employee.getDepartment() != null && employee.getDepartment().getId().equals(departmentId)) {
      return;
    }
    // Assign employee to the department
    employee.setDepartment(department);
    // Save only the employee since it's the owning side of the relationship
    employeeService.saveEmployeeEntity(employee);
    // Return department summary without reloading the entire collection if possible
    departmentMapper.toSummaryDto(department);
  }

  @Transactional
  public void removeEmployeeFromDepartment(Long departmentId, Long employeeId) {
    Department department = getDepartmentById(departmentId);
    Employee employee = employeeService.getEmployeeById(employeeId);
    // If the employee does NOT belong to this department, then nothing to remove.
    if (employee.getDepartment() == null || !employee.getDepartment().getId()
        .equals(departmentId)) {
      return;
    }
    // Otherwise, the employee is currently in this department and should be removed.
    employee.setDepartment(null);
    employeeService.saveEmployeeEntity(employee);
    department.getEmployees().remove(employee);
  }


  // Helper methods
  public Department getDepartmentById(Long id) {
    return departmentRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Department not found"));
  }
}
