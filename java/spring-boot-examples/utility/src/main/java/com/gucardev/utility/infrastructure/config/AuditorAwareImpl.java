package com.gucardev.utility.infrastructure.config;

import com.gucardev.utility.infrastructure.constants.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

@Slf4j
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                return Optional.of(Constants.DEFAULT_AUDITOR);
            }
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                return Optional.of(((UserDetails) principal).getUsername());
            }
            // Fallback if principal is not UserDetails
            return Optional.of(Constants.DEFAULT_AUDITOR);
        } catch (Exception e) {
            log.error("Error fetching current auditor", e);
            return Optional.of(Constants.DEFAULT_AUDITOR);
        }
    }
}

