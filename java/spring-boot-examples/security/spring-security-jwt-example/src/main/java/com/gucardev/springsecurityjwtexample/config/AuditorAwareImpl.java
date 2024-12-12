package com.gucardev.springsecurityjwtexample.config;

import com.gucardev.springsecurityjwtexample.constants.Constants;
import com.gucardev.springsecurityjwtexample.security.CustomUserDetails;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
public class AuditorAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == "anonymousUser") {
            return Optional.of(Constants.DEFAULT_AUDITOR);
        }
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();
        try {
            return Optional.of(userPrincipal.getUsername().toString());
        } catch (IllegalArgumentException e) {
            log.error("Could not get current auditor", e);
            return Optional.of(Constants.DEFAULT_AUDITOR);
        }
    }
}
