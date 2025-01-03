package com.gucardev.largefileoperations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

  private final Path fileStorageLocation;

  public FileStorageService(@Value("${file.upload-dir}") String uploadDir) throws IOException {
    this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    Files.createDirectories(this.fileStorageLocation);
  }

  public String storeFile(MultipartFile file) throws IOException {
    String fileName = file.getOriginalFilename();
    Path targetLocation = this.fileStorageLocation.resolve(fileName);
    Files.copy(file.getInputStream(), targetLocation);
    return fileName;
  }

  public Path loadFile(String fileName) {
    return this.fileStorageLocation.resolve(fileName).normalize();
  }
}
