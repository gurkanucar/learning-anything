package com.gucardev.treedirectorystructure;

import java.util.ArrayList;
import java.util.List;

public class DirectoryDTO {
  private Long id;
  private String name;
  private Long parentId;
  private List<DirectoryDTO> children = new ArrayList<>();

  // Constructors
  public DirectoryDTO() {}

  public DirectoryDTO(Long id, String name, Long parentId) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  public List<DirectoryDTO> getChildren() {
    return children;
  }

  public void setChildren(List<DirectoryDTO> children) {
    this.children = children;
  }

  public void addChild(DirectoryDTO child) {
    this.children.add(child);
  }
}
