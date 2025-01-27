package com.gucardev.springsecurityjwtexample.security;

import com.gucardev.springsecurityjwtexample.service.JwtTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtTokenService tokenService;

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
        if (tokenService.validateToken(jwt)) {
            String username = tokenService.getUsernameFromToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            // Uncomment this line if using default UsernamePasswordAuthenticationToken
//        UsernamePasswordAuthenticationToken authToken =
//                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            CustomUsernamePasswordAuthenticationToken authToken =
                    new CustomUsernamePasswordAuthenticationToken(userDetails, userDetails.getAuthorities(), jwt);
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else {
            sendErrorResponse(response);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
    }
}


