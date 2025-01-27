package com.gucardev.treedirectorystructure;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Directory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_id")
  private Directory parent;

  @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
  private List<Directory> children = new ArrayList<>();

  // Constructors
  public Directory() {
  }

  public Directory(String name, Directory parent) {
    this.name = name;
    this.parent = parent;
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

  public Directory getParent() {
    return parent;
  }

  public void setParent(Directory parent) {
    this.parent = parent;
  }

  public List<Directory> getChildren() {
    return children;
  }

  public void setChildren(List<Directory> children) {
    this.children = children;
  }

  // Add child helper
  public void addChild(Directory child) {
    children.add(child);
    child.setParent(this);
  }

  @Override
  public String toString() {
    return "Directory{" +
        "id=" + id +
        ", name='" + name + '\'' +
        ", parent=" + (parent != null ? parent.getName() : "null") +
        '}';
  }
}
