package com.gucardev.springsecurityjwtexample.config;

import com.gucardev.springsecurityjwtexample.constants.Constants;
import com.gucardev.springsecurityjwtexample.security.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Slf4j
public class AuditorAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                return Optional.of(Constants.DEFAULT_AUDITOR);
            }
            Object principal = authentication.getPrincipal();
            if (principal instanceof CustomUserDetails) {
                return Optional.of(((CustomUserDetails) principal).getUsername());
            }
            return Optional.of(Constants.DEFAULT_AUDITOR);
        } catch (IllegalArgumentException e) {
            return Optional.of(Constants.DEFAULT_AUDITOR);
        }
    }
}
