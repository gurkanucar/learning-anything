package com.gucardev.mapstructexample.config;

import com.gucardev.mapstructexample.entity.Department;
import com.gucardev.mapstructexample.entity.Employee;
import com.gucardev.mapstructexample.entity.Project;
import com.gucardev.mapstructexample.repository.DepartmentRepository;
import com.gucardev.mapstructexample.repository.EmployeeRepository;
import com.gucardev.mapstructexample.repository.ProjectRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitialDataPopulate implements CommandLineRunner {

  private final DepartmentRepository departmentRepository;
  private final EmployeeRepository employeeRepository;
  private final ProjectRepository projectRepository;

  @Override
  public void run(String... args) throws Exception {

    // Create some projects
    Project projectA = new Project();
    projectA.setProjectName("Project A");

    Project projectB = new Project();
    projectB.setProjectName("Project B");

    projectRepository.save(projectA);
    projectRepository.save(projectB);

    // Create Departments
    Department itDepartment = new Department();
    itDepartment.setName("IT Department");

    Department hrDepartment = new Department();
    hrDepartment.setName("HR Department");

    departmentRepository.save(itDepartment);
    departmentRepository.save(hrDepartment);

    // Create Employees
    Employee empJohn = new Employee();
    empJohn.setFirstName("John");
    empJohn.setLastName("Doe");
    empJohn.setHireDate(LocalDate.of(2020, 1, 10));
    empJohn.setDepartment(itDepartment);

    Employee empJane = new Employee();
    empJane.setFirstName("Jane");
    empJane.setLastName("Smith");
    empJane.setHireDate(LocalDate.of(2021, 3, 5));
    empJane.setDepartment(itDepartment);

    Employee empAdam = new Employee();
    empAdam.setFirstName("Adam");
    empAdam.setLastName("Johnson");
    empAdam.setHireDate(LocalDate.of(2019, 11, 23));
    empAdam.setDepartment(hrDepartment);

    Employee empSusan = new Employee();
    empSusan.setFirstName("Susan");
    empSusan.setLastName("Brown");
    empSusan.setHireDate(LocalDate.of(2018, 5, 15));
    empSusan.setDepartment(hrDepartment);

    // Assign projects to employees
    empJohn.getProjects().add(projectA);
    empJane.getProjects().add(projectA);
    empJane.getProjects().add(projectB);
    empAdam.getProjects().add(projectB);
    empSusan.getProjects().add(projectB);

    // Add employees to departments
    itDepartment.getEmployees().add(empJohn);
    itDepartment.getEmployees().add(empJane);
    hrDepartment.getEmployees().add(empAdam);
    hrDepartment.getEmployees().add(empSusan);

    // Assign Heads of Departments
    itDepartment.setHeadOfDepartment(empJohn);
    hrDepartment.setHeadOfDepartment(empSusan);

    // Save employees
    employeeRepository.save(empJohn);
    employeeRepository.save(empJane);
    employeeRepository.save(empAdam);
    employeeRepository.save(empSusan);

    // Update projects with assigned employees
    projectA.getAssignedEmployees().add(empJohn);
    projectA.getAssignedEmployees().add(empJane);
    projectB.getAssignedEmployees().add(empJane);
    projectB.getAssignedEmployees().add(empAdam);
    projectB.getAssignedEmployees().add(empSusan);

    projectRepository.save(projectA);
    projectRepository.save(projectB);

    // Update departments with employees and heads
    departmentRepository.save(itDepartment);
    departmentRepository.save(hrDepartment);

  }
}
