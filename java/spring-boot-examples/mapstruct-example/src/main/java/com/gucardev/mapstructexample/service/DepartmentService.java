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

  public DepartmentDto addEmployeeToDepartment(Long departmentId, Long employeeId) {
    Department department = getDepartmentById(departmentId);
    Employee employee = employeeService.getEmployeeById(employeeId);

    // Check if employee already assigned to a department
    if (employee.getDepartment() != null && employee.getDepartment().getId().equals(departmentId)) {
      // Employee already in this department
      return departmentMapper.toSummaryDto(department);
    }

    // Assign employee to department
    employee.setDepartment(department);
    department.getEmployees().add(employee);

    departmentRepository.save(department);
    return departmentMapper.toSummaryDto(department);
  }

  public DepartmentDto removeEmployeeFromDepartment(Long departmentId, Long employeeId) {
    Department department = getDepartmentById(departmentId);
    Employee employee = employeeService.getEmployeeById(employeeId);

    // Check if employee is part of the department
    if (employee.getDepartment() == null || !employee.getDepartment().getId()
        .equals(departmentId)) {
      throw new EntityNotFoundException("Employee not found in this department");
    }

    // Remove employee from department
    employee.setDepartment(null);
    department.getEmployees().remove(employee);

    departmentRepository.save(department);
    return departmentMapper.toSummaryDto(department);
  }

  // Helper methods
  public Department getDepartmentById(Long id) {
    return departmentRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Department not found"));
  }
}
