package com.gucardev.treedirectorystructure;

import java.util.List;

public interface DirectoryProjection {
  Long getId();
  String getName();
  Long getParentId();
  List<DirectoryProjection> getChildren();
}
