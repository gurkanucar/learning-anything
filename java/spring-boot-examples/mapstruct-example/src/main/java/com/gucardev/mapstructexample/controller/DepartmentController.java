package com.gucardev.mapstructexample.controller;


import com.gucardev.mapstructexample.dto.DepartmentDto;
import com.gucardev.mapstructexample.dto.DepartmentWithDetailsDto;
import com.gucardev.mapstructexample.dto.request.DepartmentRequest;
import com.gucardev.mapstructexample.service.DepartmentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

  private final DepartmentService departmentService;

  @GetMapping
  public List<DepartmentDto> getAllDepartments() {
    return departmentService.getAllDepartments();
  }

  @GetMapping("/{id}")
  public DepartmentWithDetailsDto getDepartmentById(@PathVariable Long id) {
    return departmentService.getDepartmentByIdDto(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public DepartmentDto createDepartment(@RequestBody DepartmentRequest departmentRequest) {
    return departmentService.createDepartment(departmentRequest);
  }

  @PutMapping("/{id}")
  public DepartmentDto updateDepartment(@PathVariable Long id,
      @RequestBody DepartmentRequest departmentRequest) {
    return departmentService.updateDepartment(id, departmentRequest);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteDepartment(@PathVariable Long id) {
    departmentService.deleteDepartment(id);
  }

  @PostMapping("/{departmentId}/employees/{employeeId}")
  public DepartmentDto addEmployeeToDepartment(@PathVariable Long departmentId,
      @PathVariable Long employeeId) {
    return departmentService.addEmployeeToDepartment(departmentId, employeeId);
  }

  @DeleteMapping("/{departmentId}/employees/{employeeId}")
  public DepartmentDto removeEmployeeFromDepartment(@PathVariable Long departmentId,
      @PathVariable Long employeeId) {
    return departmentService.removeEmployeeFromDepartment(departmentId, employeeId);
  }

}
