package com.gucardev.mapstructexample.repository;


import com.gucardev.mapstructexample.dto.request.EmployeeSearchRequest;
import com.gucardev.mapstructexample.entity.Employee;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

// EmployeeSpecification.java
public class EmployeeSpecification {

  public static Specification<Employee> createSpecification(EmployeeSearchRequest request) {
    return (root, query, criteriaBuilder) -> {
      List<Predicate> predicates = new ArrayList<>();

      // Global search parameter
      if (StringUtils.hasText(request.getSearchParam())) {
        String pattern = "%" + request.getSearchParam().toLowerCase() + "%";
        predicates.add(criteriaBuilder.or(
            criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), pattern),
            criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), pattern),
            criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), pattern)
        ));
      }

      // Individual field filters
      if (StringUtils.hasText(request.getFirstName())) {
        predicates.add(criteriaBuilder.like(
            criteriaBuilder.lower(root.get("firstName")),
            "%" + request.getFirstName().toLowerCase() + "%"
        ));
      }

      if (StringUtils.hasText(request.getLastName())) {
        predicates.add(criteriaBuilder.like(
            criteriaBuilder.lower(root.get("lastName")),
            "%" + request.getLastName().toLowerCase() + "%"
        ));
      }

      if (StringUtils.hasText(request.getEmail())) {
        predicates.add(criteriaBuilder.like(
            criteriaBuilder.lower(root.get("email")),
            "%" + request.getEmail().toLowerCase() + "%"
        ));
      }

      if (request.getAge() != null) {
        predicates.add(criteriaBuilder.equal(root.get("age"), request.getAge()));
      }

      if (request.getHireDateStart() != null) {
        predicates.add(criteriaBuilder.greaterThanOrEqualTo(
            root.get("hireDate"), request.getHireDateStart()
        ));
      }

      if (request.getHireDateEnd() != null) {
        predicates.add(criteriaBuilder.lessThanOrEqualTo(
            root.get("hireDate"), request.getHireDateEnd()
        ));
      }

      if (request.getStatusType() != null) {
        predicates.add(criteriaBuilder.equal(root.get("statusType"), request.getStatusType()));
      }

      if (request.getDepartmentId() != null) {
        predicates.add(criteriaBuilder.equal(root.get("department").get("id"),
            request.getDepartmentId()));
      }

      return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    };
  }
}