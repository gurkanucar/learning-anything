package com.gucardev.caffeinecacheexample1;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@CacheConfig(cacheNames = CacheConfiguration.CACHE_ENTITIES) // Centralized cache configuration
public class MyEntityService {

  private final MyEntityRepo myEntityRepo;
  private final ApplicationContext applicationContext;

  /**
   * Helper method to get the Spring-proxied version of this service.
   * This ensures that Spring AOP intercepts internal method calls
   * (e.g., methods annotated with @Cacheable).
   */
  private MyEntityService self() {
    return applicationContext.getBean(MyEntityService.class);
  }


  // alternatively we can set cache config individually here:
  //  @Cacheable(value = CacheConfiguration.CACHE_ENTITIES, key = "'allEntities'")
  @Cacheable(key = "'allEntities'")
  public List<MyEntity> findAll() {
    return myEntityRepo.findAll();
  }

  /**
   * Demonstrates retrieving a cached entity using a Spring-proxied call.
   * Calling self().getById ensures that @Cacheable is applied.
   */
  public void doSomethingWithCached(Long id) {
    // Use self-invocation to ensure @Cacheable is applied
    var existing = self().getById(id).orElseThrow(
        () -> new EntityNotFoundException("Entity not found"));

    // Log the entity details (could come from cache or database)
    log.info(existing.toString());
  }

  @Cacheable(key = "'category-' + #entityCategory")
  public List<MyEntity> findByCategory(EntityCategory entityCategory) {
    return myEntityRepo.findByEntityCategory(entityCategory);
  }

  @Cacheable(key = "'entity-' + #id")
  public Optional<MyEntity> getById(Long id) {
    return myEntityRepo.findById(id);
  }

  @CacheEvict(allEntries = true)
  public void create(MyEntity myEntity) {
    myEntityRepo.save(myEntity);
  }

  @CachePut(key = "'entity-' + #id")
  @CacheEvict(key = "'allEntities'")
  public void update(Long id, MyEntity myEntity) {
    // Fetch directly from the repository to avoid cache usage
    var existing = myEntityRepo.findById(id).orElseThrow(
        () -> new EntityNotFoundException("Entity not found"));

    // Update fields
    existing.setName(myEntity.getName());
    existing.setDescription(myEntity.getDescription());
    existing.setEntityCategory(myEntity.getEntityCategory());

    // Save updated entity
    myEntityRepo.save(existing);
  }


  @CacheEvict(key = "'entity-' + #id", allEntries = true)
  public void delete(Long id) {
    myEntityRepo.deleteById(id);
  }
}
