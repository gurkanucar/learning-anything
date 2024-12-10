package com.gucardev.mapstructexample.mapper;

import com.gucardev.mapstructexample.dto.EmployeeDto;
import com.gucardev.mapstructexample.dto.request.EmployeeRequest;
import com.gucardev.mapstructexample.entity.Employee;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = ProjectMapper.class)
public interface EmployeeMapper {

  EmployeeMapper INSTANCE = Mappers.getMapper(EmployeeMapper.class);

  //  @Mapping(target = "department.employees",ignore = true)
//  @Mapping(target = "department.headOfDepartment",ignore = true)
  @Named("toSummary")
  @Mapping(target = "department", ignore = true)
  @Mapping(target = "departmentId", source = "department.id")
  @Mapping(target = "headOfDepartmentId", source = "department.headOfDepartment.id")
  @Mapping(target = "projects", ignore = true)
  @Mapping(target = "fullName", expression = "java(entity.getFirstName() + \" \" + entity.getLastName())")
  EmployeeDto toSummaryDto(Employee entity);

  @Named("toFull")
  @Mapping(target = "projects", source = "projects", qualifiedByName = "mapProjectsWithoutEmployees")
  @Mapping(target = "department.employees", ignore = true)
  @Mapping(target = "department.headOfDepartment.department", ignore = true)
  @Mapping(target = "department.headOfDepartment.projects", ignore = true)
  @Mapping(target = "fullName", expression = "java(entity.getFirstName() + \" \" + entity.getLastName())")
  EmployeeDto toFullDto(Employee entity);

  Employee toEntity(EmployeeRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  Employee partialUpdate(EmployeeRequest dto, @MappingTarget Employee entity);

}
