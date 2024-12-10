package com.gucardev.mapstructexample.service;

import com.gucardev.mapstructexample.dto.DepartmentDto;
import com.gucardev.mapstructexample.dto.EmployeeDto;
import com.gucardev.mapstructexample.dto.request.DepartmentRequest;
import com.gucardev.mapstructexample.entity.Department;
import com.gucardev.mapstructexample.entity.Employee;
import com.gucardev.mapstructexample.mapper.DepartmentMapper;
import com.gucardev.mapstructexample.repository.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
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
        .map(departmentMapper::toDto)
        .toList();
  }

  public DepartmentDto createDepartment(DepartmentRequest departmentRequest) {
    var entity = departmentMapper.toEntity(departmentRequest);
    var saved = departmentRepository.save(entity);
    return departmentMapper.toDto(saved);
  }

  public DepartmentDto updateDepartment(Long id, DepartmentRequest departmentRequest) {
    var existing = getDepartmentById(id);
    // partialUpdate is a MapStruct-generated method that updates non-null fields from the request onto the entity
    departmentMapper.partialUpdate(departmentRequest, existing);
    var updated = departmentRepository.save(existing);
    return departmentMapper.toDto(updated);
  }

  public void deleteDepartment(Long id) {
    var existing = getDepartmentById(id);
    departmentRepository.delete(existing);
  }

  public Optional<Department> getDepartmentByIdOptional(Long id) {
    return departmentRepository.findById(id);
  }

  public Department getDepartmentById(Long id) {
    return getDepartmentByIdOptional(id)
        .orElseThrow(() -> new EntityNotFoundException("Department not found"));
  }

  public Optional<DepartmentDto> getDepartmentByIdDtoOptional(Long id) {
    return getDepartmentByIdOptional(id).map(departmentMapper::toDto);
  }

  public DepartmentDto getDepartmentByIdDto(Long id) {
    return departmentRepository.findById(id)
        .map(departmentMapper::toDto)
        .orElseThrow(() -> new EntityNotFoundException("Department not found"));
  }

  public DepartmentDto addEmployeeToDepartment(Long departmentId, Long employeeId) {
    Department department = getDepartmentById(departmentId);
    Employee employee = employeeService.getEmployeeById(employeeId);

    // Check if employee already assigned to a department
    // If employees can only belong to one department, just check if it's the same department
    if (employee.getDepartment() != null && employee.getDepartment().getId().equals(departmentId)) {
      // Employee already in this department
      return departmentMapper.toDto(department);
    }

    // If not assigned or assigned to another department
    employee.setDepartment(department);
    // No need to modify department.getEmployees() directly if mappedBy is on Employee side and it's a two-way relationship.
    // Depending on your owning side, you may need to ensure both sides are in sync:
    department.getEmployees().add(employee);

    departmentRepository.save(department);
    return departmentMapper.toDto(department);
  }


  public DepartmentDto removeEmployeeFromDepartment(Long departmentId, Long employeeId) {
    Department department = getDepartmentById(departmentId);
    Employee employee = employeeService.getEmployeeById(employeeId);

    // Check if this employee is indeed in this department
    if (employee.getDepartment() == null || !employee.getDepartment().getId().equals(departmentId)) {
      throw new EntityNotFoundException("Employee not found in this department");
    }

    // Disassociate
    employee.setDepartment(null);
    // If you keep a bidirectional relationship, also remove from department side:
    department.getEmployees().remove(employee);

    departmentRepository.save(department);
    return departmentMapper.toDto(department);
  }


}
