package com.gucardev.treedirectorystructure;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DirectoryRepository extends JpaRepository<Directory, Long> {

  @Query("SELECT d FROM Directory d WHERE d.parent IS NULL")
  List<Directory> findRootDirectories();


  @Query("""
    SELECT d FROM Directory d
    LEFT JOIN FETCH d.children
    """)
  List<Directory> findAllWithChildren();

  @Query("""
    SELECT d FROM Directory d
    LEFT JOIN FETCH d.children
    WHERE d.id IN :ids
    """)
  List<Directory> findAllWithChildrenByIds(@Param("ids") List<Long> ids);

}
