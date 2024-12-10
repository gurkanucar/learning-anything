package com.gucardev.mapstructexample.service;

import com.gucardev.mapstructexample.dto.DepartmentDto;
import com.gucardev.mapstructexample.dto.request.DepartmentRequest;
import com.gucardev.mapstructexample.entity.Department;
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

  private Optional<Department> getDepartmentByIdOptional(Long id) {
    return departmentRepository.findById(id);
  }

  private Department getDepartmentById(Long id) {
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

}
