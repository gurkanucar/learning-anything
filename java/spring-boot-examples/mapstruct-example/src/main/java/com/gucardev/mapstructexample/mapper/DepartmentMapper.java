package com.gucardev.mapstructexample.mapper;

import com.gucardev.mapstructexample.dto.DepartmentDto;
import com.gucardev.mapstructexample.dto.DepartmentWithDetailsDto;
import com.gucardev.mapstructexample.dto.request.DepartmentRequest;
import com.gucardev.mapstructexample.entity.Department;
import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = "spring")
public interface DepartmentMapper {

  DepartmentMapper INSTANCE = Mappers.getMapper(DepartmentMapper.class);

  @Mapping(target = "employees", ignore = true)
  @Mapping(target = "headOfDepartment", ignore = true)
  @Mapping(target = "headOfDepartmentId", source = "headOfDepartment.id")
  DepartmentDto toSummaryDto(Department entity);

  DepartmentWithDetailsDto toFullDto(Department entity);

  @AfterMapping
  default void handleAfterMapping(
      @MappingTarget DepartmentWithDetailsDto departmentWithDetailsDto) {
    if (departmentWithDetailsDto.getHeadOfDepartment() != null) {
      var firstName = departmentWithDetailsDto.getHeadOfDepartment().getFirstName();
      var lastName = departmentWithDetailsDto.getHeadOfDepartment().getLastName();
      departmentWithDetailsDto.getHeadOfDepartment()
          .setFullName(firstName + " " + lastName);
    }
    departmentWithDetailsDto.getEmployees().forEach(employee -> {
      var employeeFirstName = employee.getFirstName();
      var employeeLastName = employee.getLastName();
      employee.setFullName(employeeFirstName + " " + employeeLastName);
    });
  }

  @Mapping(source = "headOfDepartmentId", target = "headOfDepartment.id")
  Department toEntity(DepartmentRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "headOfDepartment", ignore = true)
  Department partialUpdate(DepartmentRequest request, @MappingTarget Department entity);
}
