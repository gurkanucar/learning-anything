package com.gucardev.mapstructexample.service;

import com.gucardev.mapstructexample.dto.ProjectDto;
import com.gucardev.mapstructexample.dto.request.ProjectRequest;
import com.gucardev.mapstructexample.entity.Project;
import com.gucardev.mapstructexample.mapper.ProjectMapper;
import com.gucardev.mapstructexample.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectService {

  private final ProjectRepository departmentRepository;
  private final ProjectMapper departmentMapper;

  public List<ProjectDto> getAllProjects() {
    return departmentRepository.findAll()
        .stream()
        .map(departmentMapper::toDto)
        .toList();
  }

  public ProjectDto createProject(ProjectRequest departmentRequest) {
    var entity = departmentMapper.toEntity(departmentRequest);
    var saved = departmentRepository.save(entity);
    return departmentMapper.toDto(saved);
  }

  public ProjectDto updateProject(Long id, ProjectRequest departmentRequest) {
    var existing = getProjectById(id);
    // partialUpdate is a MapStruct-generated method that updates non-null fields from the request onto the entity
    departmentMapper.partialUpdate(departmentRequest, existing);
    var updated = departmentRepository.save(existing);
    return departmentMapper.toDto(updated);
  }

  public void deleteProject(Long id) {
    var existing = getProjectById(id);
    departmentRepository.delete(existing);
  }

  public Optional<Project> getProjectByIdOptional(Long id) {
    return departmentRepository.findById(id);
  }

  public Project getProjectById(Long id) {
    return getProjectByIdOptional(id)
        .orElseThrow(() -> new EntityNotFoundException("Project not found"));
  }

  public Optional<ProjectDto> getProjectByIdDtoOptional(Long id) {
    return getProjectByIdOptional(id).map(departmentMapper::toDto);
  }

  public ProjectDto getProjectByIdDto(Long id) {
    return departmentRepository.findById(id)
        .map(departmentMapper::toDto)
        .orElseThrow(() -> new EntityNotFoundException("Project not found"));
  }

}
