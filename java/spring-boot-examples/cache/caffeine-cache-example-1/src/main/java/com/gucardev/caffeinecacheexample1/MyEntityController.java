package com.gucardev.caffeinecacheexample1;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entities")
@RequiredArgsConstructor
public class MyEntityController {

  private final MyEntityService myEntityService;

  @GetMapping
  public ResponseEntity<List<MyEntity>> getAllEntities() {
    return ResponseEntity.ok(myEntityService.findAll());
  }

  @GetMapping("/category/{category}")
  public ResponseEntity<List<MyEntity>> getByCategory(@PathVariable EntityCategory category) {
    return ResponseEntity.ok(myEntityService.findByCategory(category));
  }

  @GetMapping("/{id}")
  public ResponseEntity<MyEntity> getById(@PathVariable Long id) {
    return myEntityService.getById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Void> createEntity(@RequestBody MyEntity myEntity) {
    myEntityService.create(myEntity);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<Void> updateEntity(@PathVariable Long id, @RequestBody MyEntity myEntity) {
    myEntityService.update(id,myEntity);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEntity(@PathVariable Long id) {
    myEntityService.delete(id);
    return ResponseEntity.ok().build();
  }
}
