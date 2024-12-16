package com.gucardev.mapstructexample.config;

import com.github.javafaker.Faker;
import com.gucardev.mapstructexample.entity.Department;
import com.gucardev.mapstructexample.entity.Employee;
import com.gucardev.mapstructexample.entity.Project;
import com.gucardev.mapstructexample.enumeration.StatusType;
import com.gucardev.mapstructexample.repository.DepartmentRepository;
import com.gucardev.mapstructexample.repository.EmployeeRepository;
import com.gucardev.mapstructexample.repository.ProjectRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class InitialDataPopulate implements CommandLineRunner {

  private final DepartmentRepository departmentRepository;
  private final EmployeeRepository employeeRepository;
  private final ProjectRepository projectRepository;
  private final Faker faker = new Faker();

  @Transactional
  @Override
  public void run(String... args) throws Exception {
    // Create departments
    List<Department> departments = createDepartments();

    // Create projects
    List<Project> projects = createProjects();

    // Create employees and associate them with departments and projects
    createEmployeesWithAssociations(departments, projects);

    // Set department heads
    assignDepartmentHeads(departments);

    // Save everything
    saveToDB(departments, projects);
  }

  private List<Department> createDepartments() {
    String[] departmentNames = {
        "IT", "HR", "Finance", "Marketing", "Sales",
        "Engineering", "Research", "Operations", "Legal", "Customer Support"
    };

    List<Department> departments = new ArrayList<>();
    for (String name : departmentNames) {
      Department dept = new Department();
      dept.setName(name + " Department");
      dept.setEmployees(new ArrayList<>());
      departments.add(dept);
    }
    return departments;
  }

  private List<Project> createProjects() {
    String[] projectPrefixes = {"Project", "Initiative", "Program", "Implementation"};
    String[] projectThemes = {"Digital", "Cloud", "Mobile", "AI", "Analytics", "Security"};

    List<Project> projects = new ArrayList<>();
    for (String prefix : projectPrefixes) {
      for (String theme : projectThemes) {
        Project project = new Project();
        project.setProjectName(prefix + " " + theme);
        project.setAssignedEmployees(new HashSet<>());
        projects.add(project);
      }
    }
    return projects;
  }

  private void createEmployeesWithAssociations(List<Department> departments,
      List<Project> projects) {
    // Create 1000 employees
    for (int i = 0; i < 200; i++) {
      Employee emp = createRandomEmployee();

      // Assign to random department
      Department randomDept = departments.get(faker.number().numberBetween(0, departments.size()));
      emp.setDepartment(randomDept);
      randomDept.getEmployees().add(emp);

      // Assign 1-3 random projects
      int numProjects = faker.number().numberBetween(1, 4);
      Set<Project> employeeProjects = new HashSet<>();
      for (int j = 0; j < numProjects; j++) {
        Project randomProject = projects.get(faker.number().numberBetween(0, projects.size()));
        employeeProjects.add(randomProject);
        randomProject.getAssignedEmployees().add(emp);
      }
      emp.setProjects(employeeProjects);
    }
  }

  private Employee createRandomEmployee() {
    Employee emp = new Employee();

    // Generate name and email
    String firstName = faker.name().firstName();
    String lastName = faker.name().lastName();
    emp.setFirstName(firstName);
    emp.setLastName(lastName);
    emp.setEmail(generateEmail(firstName, lastName));

    // Generate age between 22 and 65
    emp.setAge(faker.number().numberBetween(22, 66));

    // Random status
    emp.setStatusType(faker.random().nextBoolean() ? StatusType.ACTIVE : StatusType.PASSIVE);

    // Generate hire date within last 10 years
    Date hireDate = faker.date().past(3650, TimeUnit.DAYS);
    emp.setHireDate(LocalDate.ofInstant(hireDate.toInstant(), ZoneId.systemDefault()));

    return emp;
  }

  private String generateEmail(String firstName, String lastName) {
    String[] domains = {"company.com", "corp.net", "enterprise.org"};
    String domain = domains[faker.number().numberBetween(0, domains.length)];
    return firstName.toLowerCase().charAt(0) +
        lastName.toLowerCase().replaceAll("[^a-zA-Z0-9]", "") +
        faker.number().numberBetween(1, 999) +
        "@" + domain;
  }

  private void assignDepartmentHeads(List<Department> departments) {
    for (Department dept : departments) {
      if (!dept.getEmployees().isEmpty()) {
        // Pick random employee from department as head
        List<Employee> deptEmployees = new ArrayList<>(dept.getEmployees());
        Employee headOfDept = deptEmployees.get(
            faker.number().numberBetween(0, deptEmployees.size()));
        dept.setHeadOfDepartment(headOfDept);
      }
    }
  }

  private void saveToDB(List<Department> departments, List<Project> projects) {
    // Save all departments (which will cascade save employees)
    departmentRepository.saveAll(departments);

    // Save all projects
    projectRepository.saveAll(projects);
  }
}