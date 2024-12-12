package com.gucardev.mapstructexample.repository;

import com.gucardev.mapstructexample.entity.Employee;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

  List<Employee> findByDepartment_Id(Long id);
}
