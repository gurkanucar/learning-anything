package com.gucardev.springsecurityjwtexample.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gucardev.springsecurityjwtexample.service.JwtDecoderService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

  private final JwtDecoderService jwtDecoderService;
  private final UserDetailsServiceImpl userDetailsService;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    String jwt = authorizationHeader.substring(7);

    try {
      String username = jwtDecoderService.extractUsername(jwt);
      UserDetails userDetails = userDetailsService.loadUserByUsername(username);

      if (!jwtDecoderService.isTokenValid(jwt,
          ((CustomUserDetails) userDetails).getUser().getTokenSign())) {
        throw new JwtException("Invalid JWT");
      }
//        UsernamePasswordAuthenticationToken authToken =
//                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

      CustomUsernamePasswordAuthenticationToken authToken =
          new CustomUsernamePasswordAuthenticationToken(userDetails,
              userDetails.getAuthorities(), jwt);
      authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
      SecurityContextHolder.getContext().setAuthentication(authToken);


    } catch (JwtException e) {
      sendErrorResponse(response, e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED);
      return;
    } catch (Exception e) {
      sendErrorResponse(response, "Authentication failed", HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }

    filterChain.doFilter(request, response);
  }

  private void sendErrorResponse(HttpServletResponse response, String message, int status)
      throws IOException {
    response.setStatus(status);
    response.setContentType("application/json");
    Map<String, String> errorResponse = Collections.singletonMap("error", message);
    new ObjectMapper().writeValue(response.getWriter(), errorResponse);
  }
}

