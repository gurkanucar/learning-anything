package com.gucardev.mapstructexample.mapper;

import com.gucardev.mapstructexample.dto.ProjectDto;
import com.gucardev.mapstructexample.dto.request.ProjectRequest;
import com.gucardev.mapstructexample.entity.Employee;
import com.gucardev.mapstructexample.entity.Project;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

  ProjectMapper INSTANCE = Mappers.getMapper(ProjectMapper.class);

  @Mapping(target = "assignedEmployeesIdList", source = "assignedEmployees", qualifiedByName = "mapEmployeeIds")
  @Mapping(target = "assignedEmployees", ignore = true)
  ProjectDto toDto(Project entity);


  @Named("mapProjectsWithoutEmployees")
  @Mapping(target = "assignedEmployees", ignore = true)
  ProjectDto toDtoWithoutEmployees(Project project);

  Project toEntity(ProjectRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  Project partialUpdate(ProjectRequest dto, @MappingTarget Project entity);

  @Named("mapEmployeeIds")
  default Set<Long> mapEmployeeIds(Set<Employee> employees) {
    if (employees == null) {
      return new HashSet<>();
    }
    return employees.stream()
        .map(Employee::getId)
        .collect(Collectors.toSet());
  }

}
