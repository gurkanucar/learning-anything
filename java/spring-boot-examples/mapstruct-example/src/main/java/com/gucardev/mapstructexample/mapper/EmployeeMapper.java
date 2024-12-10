package com.gucardev.mapstructexample.mapper;

import com.gucardev.mapstructexample.dto.EmployeeDto;
import com.gucardev.mapstructexample.dto.request.EmployeeRequest;
import com.gucardev.mapstructexample.entity.Employee;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

  EmployeeMapper INSTANCE = Mappers.getMapper(EmployeeMapper.class);

  EmployeeDto toDto(Employee entity);

  Employee toEntity(EmployeeRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  Employee partialUpdate(EmployeeRequest dto, @MappingTarget Employee entity);

}
