package com.gucardev.caffeinecacheexample1;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MyEntityRepo extends JpaRepository<MyEntity, Long> {

  List<MyEntity> findByEntityCategory(EntityCategory entityCategory);
}
