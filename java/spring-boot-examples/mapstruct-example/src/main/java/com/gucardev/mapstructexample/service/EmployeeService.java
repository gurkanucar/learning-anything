package com.gucardev.mapstructexample.service;

import com.gucardev.mapstructexample.dto.EmployeeDto;
import com.gucardev.mapstructexample.dto.request.EmployeeRequest;
import com.gucardev.mapstructexample.entity.Employee;
import com.gucardev.mapstructexample.mapper.EmployeeMapper;
import com.gucardev.mapstructexample.repository.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeService {

  private final EmployeeRepository departmentRepository;
  private final EmployeeMapper departmentMapper;

  public List<EmployeeDto> getAllEmployees() {
    return departmentRepository.findAll()
        .stream()
        .map(departmentMapper::toDto)
        .toList();
  }

  public EmployeeDto createEmployee(EmployeeRequest departmentRequest) {
    var entity = departmentMapper.toEntity(departmentRequest);
    var saved = departmentRepository.save(entity);
    return departmentMapper.toDto(saved);
  }

  public EmployeeDto updateEmployee(Long id, EmployeeRequest departmentRequest) {
    var existing = getEmployeeById(id);
    // partialUpdate is a MapStruct-generated method that updates non-null fields from the request onto the entity
    departmentMapper.partialUpdate(departmentRequest, existing);
    var updated = departmentRepository.save(existing);
    return departmentMapper.toDto(updated);
  }

  public void deleteEmployee(Long id) {
    var existing = getEmployeeById(id);
    departmentRepository.delete(existing);
  }

  private Optional<Employee> getEmployeeByIdOptional(Long id) {
    return departmentRepository.findById(id);
  }

  private Employee getEmployeeById(Long id) {
    return getEmployeeByIdOptional(id)
        .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
  }

  public Optional<EmployeeDto> getEmployeeByIdDtoOptional(Long id) {
    return getEmployeeByIdOptional(id).map(departmentMapper::toDto);
  }

  public EmployeeDto getEmployeeByIdDto(Long id) {
    return departmentRepository.findById(id)
        .map(departmentMapper::toDto)
        .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
  }

}
