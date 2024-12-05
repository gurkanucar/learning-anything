package com.gucardev.formulacalculatedfields;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Formula;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Employee {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String firstName;
  private String lastName;
  private BigDecimal monthlySalary;
  private LocalDate birthDate;
  private Boolean isStudent;
  @Formula("concat(first_name, ' ', last_name)")
  private String fullName;
  @Formula("monthly_salary * 12")
  private Double yearlySalary;
  @Formula("year(current_date) - year(birth_date)")
  private Integer age;
  @Formula("case " +
      "when (year(current_date) - year(birth_date)) >= 18 "
      + "and is_student = false then true " +
      "else false end")
  private Boolean isEligibleForDriverLicense;
}