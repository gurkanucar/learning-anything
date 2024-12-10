package com.gucardev.mapstructexample.mapper;

import com.gucardev.mapstructexample.dto.DepartmentDto;
import com.gucardev.mapstructexample.dto.request.DepartmentRequest;
import com.gucardev.mapstructexample.entity.Department;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

  DepartmentMapper INSTANCE = Mappers.getMapper(DepartmentMapper.class);

  DepartmentDto toDto(Department entity);

  Department toEntity(DepartmentRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  Department partialUpdate(DepartmentRequest request, @MappingTarget Department entity);

}
