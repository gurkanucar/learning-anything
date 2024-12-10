package com.gucardev.mapstructexample.controller;

import com.gucardev.mapstructexample.dto.ProjectDto;
import com.gucardev.mapstructexample.dto.request.ProjectRequest;
import com.gucardev.mapstructexample.service.ProjectService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

  private final ProjectService projectService;

  @GetMapping
  public List<ProjectDto> getAllProjects() {
    return projectService.getAllProjects();
  }

  @GetMapping("/{id}")
  public ProjectDto getProjectById(@PathVariable Long id) {
    return projectService.getProjectByIdDto(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ProjectDto createProject(@RequestBody ProjectRequest request) {
    return projectService.createProject(request);
  }

  @PutMapping("/{id}")
  public ProjectDto updateProject(@PathVariable Long id,
      @RequestBody ProjectRequest request) {
    return projectService.updateProject(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteProject(@PathVariable Long id) {
    projectService.deleteProject(id);
  }

}
