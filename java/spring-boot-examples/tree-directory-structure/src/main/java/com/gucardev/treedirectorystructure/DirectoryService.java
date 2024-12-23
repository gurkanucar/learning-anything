package com.gucardev.treedirectorystructure;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DirectoryService {

  @Autowired
  private DirectoryRepository directoryRepository;

  public Directory createDirectory(String name, Long parentId) {
    Directory parent = null;
    if (parentId != null) {
      parent = directoryRepository.findById(parentId)
          .orElseThrow(() -> new RuntimeException("Parent directory not found"));
    }

    Directory directory = new Directory(name, parent);
    if (parent != null) {
      parent.addChild(directory);
    }
    return directoryRepository.save(directory);
  }

  public DirectoryDTO getDirectory(Long id) {
    Directory directory = directoryRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Directory not found"));

    return DirectoryMapper.toDTO(directory);
  }

  public void deleteDirectory(Long id) {
    directoryRepository.deleteById(id);
  }

  public List<DirectoryDTO> getAllDirectories() {
    List<Directory> rootDirectories = directoryRepository.findRootDirectories();
    return rootDirectories.stream()
        .map(DirectoryMapper::toDTO)
        .collect(Collectors.toList());
  }

  public List<DirectoryDTO> getAllByJPA() {
    List<Directory> directories = directoryRepository.findAllWithChildren();
    return directories.stream()
        .filter(directory -> directory.getParent() == null) // Only root directories
        .map(DirectoryMapper::toDTO)
        .toList();
  }


}
