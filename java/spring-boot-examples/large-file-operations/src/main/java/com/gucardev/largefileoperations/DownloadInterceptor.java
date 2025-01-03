package com.gucardev.largefileoperations;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class DownloadInterceptor implements HandlerInterceptor {

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
    String uri = request.getRequestURI();
    if (uri.startsWith("/api/files/download/") && response.getStatus() == HttpServletResponse.SC_OK) {
      // Perform the logic after successful download
      System.out.println("File downloaded successfully: " + uri);

      // Example: Log download event or trigger some logic
      // You can call a service here to save the download event in the database
    }
  }
}
