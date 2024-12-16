package com.gucardev.mapstructexample.service;

import com.gucardev.mapstructexample.dto.EmployeeDto;
import com.gucardev.mapstructexample.dto.request.EmployeeRequest;
import com.gucardev.mapstructexample.dto.request.EmployeeSearchRequest;
import com.gucardev.mapstructexample.entity.Employee;
import com.gucardev.mapstructexample.entity.Project;
import com.gucardev.mapstructexample.mapper.EmployeeMapper;
import com.gucardev.mapstructexample.repository.EmployeeRepository;
import com.gucardev.mapstructexample.repository.EmployeeSpecification;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeService {

  private final EmployeeRepository employeeRepository; // Renamed from departmentRepository for clarity
  private final EmployeeMapper employeeMapper;
  private final ProjectService projectService; // Inject ProjectService

  public Page<EmployeeDto> searchEmployees(EmployeeSearchRequest request) {
    Pageable pageable = PageRequest.of(
        request.getPage(),
        request.getPageSize(),
        Sort.by(request.getSortOrder(), request.getSortBy())
    );

    Page<Employee> employeePage = employeeRepository.findAll(
        EmployeeSpecification.createSpecification(request),
        pageable
    );

    return employeePage.map(employeeMapper::toSummaryDto);
  }

  public EmployeeDto createEmployee(EmployeeRequest employeeRequest) {
    var entity = employeeMapper.toEntity(employeeRequest);
    var saved = employeeRepository.save(entity);
    return employeeMapper.toFullDto(saved);
  }

  public void saveEmployeeEntity( Employee employee) {
    employeeRepository.save(employee);
  }


  public EmployeeDto updateEmployee(Long id, EmployeeRequest employeeRequest) {
    var existing = getEmployeeById(id);
    employeeMapper.partialUpdate(employeeRequest, existing);
    var updated = employeeRepository.save(existing);
    return employeeMapper.toFullDto(updated);
  }

  public void deleteEmployee(Long id) {
    var existing = getEmployeeById(id);
    employeeRepository.delete(existing);
  }

  public Optional<Employee> getEmployeeByIdOptional(Long id) {
    return employeeRepository.findById(id);
  }

  public Employee getEmployeeById(Long id) {
    return getEmployeeByIdOptional(id)
        .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
  }

  public Optional<EmployeeDto> getEmployeeByIdDtoOptional(Long id) {
    return getEmployeeByIdOptional(id).map(employeeMapper::toFullDto);
  }

  public EmployeeDto getEmployeeByIdDto(Long id) {
    return employeeRepository.findById(id)
        .map(employeeMapper::toFullDto)
        .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
  }

  // Assign a project to employee
  public EmployeeDto addProjectToEmployee(Long employeeId, Long projectId) {
    Employee employee = getEmployeeById(employeeId);
    Project project = projectService.getProjectById(projectId);

    // Check if employee already assigned to the project
    if (!employee.getProjects().contains(project)) {
      employee.getProjects().add(project);
      project.getAssignedEmployees().add(employee);
      // Only need to save one side (the owning side); typically Employee is owning side in ManyToMany mapping.
      employeeRepository.save(employee);
    }

    return employeeMapper.toFullDto(employee);
  }

  // Remove a project from an employee
  public EmployeeDto removeProjectFromEmployee(Long employeeId, Long projectId) {
    Employee employee = getEmployeeById(employeeId);
    Project project = projectService.getProjectById(projectId);

    // Check if the project is actually assigned to the employee
    if (!employee.getProjects().contains(project)) {
      throw new EntityNotFoundException("Project not assigned to this employee");
    }

    employee.getProjects().remove(project);
    project.getAssignedEmployees().remove(employee);

    employeeRepository.save(employee);

    return employeeMapper.toFullDto(employee);
  }

  public List<EmployeeDto> getAllEmployeesByDepartmentId(Long departmentId) {
    return employeeRepository.findByDepartment_Id(departmentId).stream()
        .map(employeeMapper::toSummaryDto)
        .toList();
  }

}
