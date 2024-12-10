package com.gucardev.mapstructexample.mapper;

import com.gucardev.mapstructexample.dto.ProjectDto;
import com.gucardev.mapstructexample.dto.request.ProjectRequest;
import com.gucardev.mapstructexample.entity.Project;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

  ProjectMapper INSTANCE = Mappers.getMapper(ProjectMapper.class);

  ProjectDto toDto(Project entity);

  Project toEntity(ProjectRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  Project partialUpdate(ProjectRequest dto, @MappingTarget Project entity);

}
