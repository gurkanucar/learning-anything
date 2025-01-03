package com.gucardev.largefileoperations;

import jakarta.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Files;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/files")
public class FileController {

  @Autowired
  private FileStorageService fileStorageService;

  @PostMapping("/upload")
  public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
    return "File uploaded successfully: " + fileStorageService.storeFile(file);
  }

  @GetMapping("/download/{fileName}")
  public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws IOException {
    Path filePath = fileStorageService.loadFile(fileName);
    Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());

    if (resource.exists() && resource.isReadable()) {
      return ResponseEntity.ok()
          .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
          .body(resource);
    } else {
      throw new RuntimeException("File not found " + fileName);
    }
  }

  @GetMapping("/download2/{fileName}")
  public void downloadFile(@PathVariable String fileName, HttpServletResponse response) throws IOException {
    Path filePath = fileStorageService.loadFile(fileName);

    if (Files.exists(filePath)) {
      response.setContentType(Files.probeContentType(filePath));
      response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");

      long startTime = System.nanoTime(); // Start time

      try (OutputStream out = response.getOutputStream()) {
        Files.copy(filePath, out);
        out.flush();
      }

      long endTime = System.nanoTime(); // End time
      long duration = (endTime - startTime) / 1_000_000; // Convert to milliseconds

      // Log download duration
      System.out.println("File download completed: " + fileName);
      System.out.println("Time taken to download: " + duration + " ms");

    } else {
      response.setStatus(HttpServletResponse.SC_NOT_FOUND);
      response.getWriter().write("File not found.");
    }
  }

  @GetMapping("/download/stream/{fileName}")
  public ResponseEntity<StreamingResponseBody> streamFile(@PathVariable String fileName) throws IOException {
    Path filePath = fileStorageService.loadFile(fileName);

    if (!Files.exists(filePath)) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    long fileSize = Files.size(filePath);

    // StreamingResponseBody allows us to write to the output stream directly
    StreamingResponseBody responseBody = outputStream -> {
      // Use try-with-resources to ensure InputStream is closed properly
      try (InputStream inputStream = Files.newInputStream(filePath)) {
        byte[] buffer = new byte[4096];
        int bytesRead;

        // Read the file in chunks and write each chunk to outputStream
        while ((bytesRead = inputStream.read(buffer)) != -1) {
          outputStream.write(buffer, 0, bytesRead);
        }
        outputStream.flush();
      } finally {
        // Delete the file after the download completes or fails
        Files.delete(filePath);
        System.out.println("File deleted after download: " + fileName);

        // Log the action
        System.out.println("Download completed for file: " + fileName);
      }
    };

    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .contentLength(fileSize)
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
        .body(responseBody);
  }



}
