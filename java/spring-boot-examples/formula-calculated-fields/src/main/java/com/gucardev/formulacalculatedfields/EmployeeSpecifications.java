package com.gucardev.formulacalculatedfields;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

public class EmployeeSpecifications {

  public static Specification<Employee> searchByFullName(String fullName) {
    String likeTerm = "%" + fullName.toLowerCase() + "%";
    return (Root<Employee> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) ->
        criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), likeTerm);
  }
}

