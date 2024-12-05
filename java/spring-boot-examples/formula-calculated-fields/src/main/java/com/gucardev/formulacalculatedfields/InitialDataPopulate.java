package com.gucardev.formulacalculatedfields;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InitialDataPopulate implements CommandLineRunner {

  private final EmployeeService employeeService;

  @Override
  public void run(String... args) {

    var employee1 = new Employee();
    employee1.setFirstName("John");
    employee1.setLastName("Doe");
    employee1.setMonthlySalary(BigDecimal.valueOf(17002));
    employee1.setBirthDate(LocalDate.of(2008, 4, 15));
    employeeService.saveEmployee(employee1);

    var employee2 = new Employee();
    employee2.setFirstName("Alice");
    employee2.setLastName("Smith");
    employee2.setMonthlySalary(BigDecimal.valueOf(22000));
    employee2.setBirthDate(LocalDate.of(1987, 12, 1));
    employeeService.saveEmployee(employee2);

    var employee3 = new Employee();
    employee3.setFirstName("Bob");
    employee3.setLastName("Johnson");
    employee3.setMonthlySalary(BigDecimal.valueOf(8000));
    employee3.setBirthDate(LocalDate.of(1995, 6, 22));
    employeeService.saveEmployee(employee3);

    var employee4 = new Employee();
    employee4.setFirstName("Emily");
    employee4.setLastName("Davis");
    employee4.setMonthlySalary(BigDecimal.valueOf(35000));
    employee4.setBirthDate(LocalDate.of(1980, 9, 10));
    employeeService.saveEmployee(employee4);

    var employee5 = new Employee();
    employee5.setFirstName("Michael");
    employee5.setLastName("Williams");
    employee5.setMonthlySalary(BigDecimal.valueOf(75000));
    employee5.setBirthDate(LocalDate.of(1975, 11, 30));
    employeeService.saveEmployee(employee5);

    var employee6 = new Employee();
    employee6.setFirstName("Sarah");
    employee6.setLastName("Martinez");
    employee6.setMonthlySalary(BigDecimal.ZERO);  // no salary
    employee6.setBirthDate(LocalDate.of(2000, 7, 10));
    employeeService.saveEmployee(employee6);

    var employee7 = new Employee();
    employee7.setFirstName("David");
    employee7.setLastName("Miller");
    employee7.setMonthlySalary(BigDecimal.valueOf(48000));
    employee7.setBirthDate(LocalDate.of(1982, 3, 25));
    employeeService.saveEmployee(employee7);

    var employee8 = new Employee();
    employee8.setFirstName("Linda");
    employee8.setLastName("Taylor");
    employee8.setMonthlySalary(BigDecimal.valueOf(32000));
    employee8.setBirthDate(LocalDate.of(1990, 8, 13));
    employeeService.saveEmployee(employee8);

  }
}
