package com.gucardev.utility.infrastructure.filter;

import com.gucardev.utility.infrastructure.annotation.ExcludeFromAspect;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@ExcludeFromAspect
@Component
@Slf4j
public class CustomOncePerRequestFilter extends OncePerRequestFilter {

  private static final String[] IGNORED_ENDPOINTS = {"/download", "/health", "/status"};

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    // Pre-processing logic (runs before the request is processed by controllers)
    log.info("Request URI: {}", request.getRequestURI());

    // Continue with the next filter or the actual request
    filterChain.doFilter(request, response);

    // Post-processing logic (runs after the response is generated)
    log.info("Response Status: {}", response.getStatus());
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String requestUri = request.getRequestURI();
    for (String endpoint : IGNORED_ENDPOINTS) {
      if (requestUri.startsWith(endpoint)) {
        log.debug("Skipping filter for URI: {}", requestUri);
        return true;
      }
    }
    return false;
  }
}
