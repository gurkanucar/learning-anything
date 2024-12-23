package com.gucardev.treedirectorystructure;

import java.util.stream.Collectors;

public class DirectoryMapper {

  public static DirectoryDTO toDTO(Directory directory) {
    if (directory == null) {
      return null;
    }

    DirectoryDTO dto = new DirectoryDTO(
        directory.getId(),
        directory.getName(),
        directory.getParent() != null ? directory.getParent().getId() : null
    );

    dto.setChildren(directory.getChildren()
        .stream()
        .map(DirectoryMapper::toDTO)
        .collect(Collectors.toList())
    );

    return dto;
  }
}
