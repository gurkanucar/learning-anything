package com.gucardev.treedirectorystructure;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/directories")
public class DirectoryController {

  @Autowired
  private DirectoryService directoryService;

  @GetMapping
  public List<DirectoryDTO> getAllDirectories() {
    return directoryService.getAllDirectories();
  }

  @GetMapping("/jpa")
  public List<DirectoryDTO> getAllDirectoriesJPA() {
    return directoryService.getAllByJPA();
  }

  @PostMapping
  public Directory createDirectory(@RequestParam String name,
      @RequestParam(required = false) Long parentId) {
    return directoryService.createDirectory(name, parentId);
  }

  @GetMapping("/{id}")
  public DirectoryDTO getDirectory(@PathVariable Long id) {
    return directoryService.getDirectory(id);
  }

  @GetMapping("/only-directory/{id}")
  public DirectoryDTO getOnlyDirectory(@PathVariable Long id) {
    return directoryService.getOnlyDirectory(id);
  }

  @DeleteMapping("/{id}")
  public void deleteDirectory(@PathVariable Long id) {
    directoryService.deleteDirectory(id);
  }

  @GetMapping("/by-ids")
  public List<DirectoryDTO> getDirectoriesByIds(@RequestParam List<Long> ids) {
    return directoryService.getAllByIds(ids);
  }
}
