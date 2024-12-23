package com.gucardev.treedirectorystructure;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

  @Bean
  CommandLineRunner initData(DirectoryRepository directoryRepository) {
    return args -> {
      // Root directories
      Directory root1 = new Directory("Root Directory 1", null);
      Directory root2 = new Directory("Root Directory 2", null);
      Directory root3 = new Directory("Root Directory 3", null);

      // Adding children and subchildren to root1
      for (int i = 1; i <= 10; i++) {
        Directory subDir = new Directory("SubDirectory 1." + i, root1);
        root1.addChild(subDir);

        for (int j = 1; j <= 5; j++) {
          Directory subSubDir = new Directory("SubSubDirectory 1." + i + "." + j, subDir);
          subDir.addChild(subSubDir);

          for (int k = 1; k <= 3; k++) {
            Directory subSubSubDir = new Directory("SubSubSubDirectory 1." + i + "." + j + "." + k, subSubDir);
            subSubDir.addChild(subSubSubDir);

            for (int l = 1; l <= 2; l++) {
              Directory subSubSubSubDir = new Directory("SubSubSubSubDirectory 1." + i + "." + j + "." + k + "." + l, subSubSubDir);
              subSubSubDir.addChild(subSubSubSubDir);

              for (int m = 1; m <= 2; m++) {
                Directory subSubSubSubSubDir = new Directory("SubSubSubSubSubDirectory 1." + i + "." + j + "." + k + "." + l + "." + m, subSubSubSubDir);
                subSubSubSubDir.addChild(subSubSubSubSubDir);
              }
            }
          }
        }
      }

      // Adding children and subchildren to root2
      for (int i = 1; i <= 5; i++) {
        Directory subDir = new Directory("SubDirectory 2." + i, root2);
        root2.addChild(subDir);

        for (int j = 1; j <= 7; j++) {
          Directory subSubDir = new Directory("SubSubDirectory 2." + i + "." + j, subDir);
          subDir.addChild(subSubDir);

          for (int k = 1; k <= 4; k++) {
            Directory subSubSubDir = new Directory("SubSubSubDirectory 2." + i + "." + j + "." + k, subSubDir);
            subSubDir.addChild(subSubSubDir);

            for (int l = 1; l <= 3; l++) {
              Directory subSubSubSubDir = new Directory("SubSubSubSubDirectory 2." + i + "." + j + "." + k + "." + l, subSubSubDir);
              subSubSubDir.addChild(subSubSubSubDir);
            }
          }
        }
      }

      // Adding children and subchildren to root3
      for (int i = 1; i <= 7; i++) {
        Directory subDir = new Directory("SubDirectory 3." + i, root3);
        root3.addChild(subDir);

        for (int j = 1; j <= 6; j++) {
          Directory subSubDir = new Directory("SubSubDirectory 3." + i + "." + j, subDir);
          subDir.addChild(subSubDir);

          for (int k = 1; k <= 5; k++) {
            Directory subSubSubDir = new Directory("SubSubSubDirectory 3." + i + "." + j + "." + k, subSubDir);
            subSubDir.addChild(subSubSubDir);
          }
        }
      }

      // Persist to database
      directoryRepository.save(root1);
      directoryRepository.save(root2);
      directoryRepository.save(root3);
    };
  }
}
