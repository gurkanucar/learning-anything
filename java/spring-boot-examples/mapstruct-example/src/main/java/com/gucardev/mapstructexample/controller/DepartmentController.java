package com.gucardev.mapstructexample.controller;


import com.gucardev.mapstructexample.dto.DepartmentDto;
import com.gucardev.mapstructexample.dto.DepartmentWithDetailsDto;
import com.gucardev.mapstructexample.dto.request.DepartmentRequest;
import com.gucardev.mapstructexample.service.DepartmentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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
  public ResponseEntity<Object> addEmployeeToDepartment(@PathVariable Long departmentId,
      @PathVariable Long employeeId) {
    departmentService.addEmployeeToDepartment(departmentId, employeeId);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @DeleteMapping("/{departmentId}/employees/{employeeId}")
  public ResponseEntity<Object> removeEmployeeFromDepartment(@PathVariable Long departmentId,
      @PathVariable Long employeeId) {
    departmentService.removeEmployeeFromDepartment(departmentId, employeeId);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

}
