package com.gucardev.dbconfigparameters;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigParameterRepository extends JpaRepository<ConfigParameter, Long> {
  Optional<ConfigParameter> findByConfigName(String name);
}
