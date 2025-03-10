package com.gucardev.utility.infrastructure.config;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import com.gucardev.utility.infrastructure.util.CRLFLogConverter;
import io.micrometer.common.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@Slf4j
public class StarterConfig implements CommandLineRunner {

    private final Environment environment;

    public StarterConfig(Environment environment) {
        this.environment = environment;
    }

    // REST Endpoint
    @GetMapping({"/", "/hello"})
    public ResponseEntity<String> helloWorld() {
        return ResponseEntity.ok("Hello World!");
    }

    @GetMapping({"/timezone", "/time"})
    public ResponseEntity<Map<String, String>> getTimezone() {
        Map<String, String> response = new HashMap<>();
        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime now = ZonedDateTime.now(zoneId);

        response.put("timezone", zoneId.getId());
        response.put("offset", zoneId.getRules().getOffset(now.toInstant()).getId());
        response.put("currentTime", now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z")));

        return ResponseEntity.ok(response);
    }

    // Simple logging level control
    @PutMapping("/log-level")
    public ResponseEntity<String> changeLogLevel(@RequestParam String level) {
        try {
            Logger rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
            rootLogger.setLevel(Level.valueOf(level.toUpperCase()));
            log.info("Log level changed to: {}", level.toUpperCase());
            return ResponseEntity.ok("Log level changed to: " + level.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid log level. Use: TRACE, DEBUG, INFO, WARN, ERROR");
        }
    }

    @GetMapping("/log-level")
    public ResponseEntity<String> getLogLevel() {
        Logger rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        return ResponseEntity.ok("Current log level: " + rootLogger.getLevel());
    }

    // Application Startup Logging
    @Override
    public void run(String... args) {
        logApplicationStartup();
    }

    private void logApplicationStartup() {
        String protocol = Optional.ofNullable(environment.getProperty("server.ssl.key-store"))
                .map(key -> "https")
                .orElse("http");
        String applicationName = environment.getProperty("spring.application.name", "Application");
        String serverPort = environment.getProperty("server.port", "8080");
        String contextPath = Optional.ofNullable(environment.getProperty("server.servlet.context-path"))
                .filter(StringUtils::isNotBlank)
                .orElse("/");
        String hostAddress = "localhost";
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            log.warn("The host name could not be determined, using `localhost` as fallback");
        }

        // Get timezone information
        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime now = ZonedDateTime.now(zoneId);
        String timezoneInfo = String.format("Timezone: %s (%s)",
                zoneId.getId(),
                zoneId.getRules().getOffset(now.toInstant()).getId());

        // Get logging levels
        Logger rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        String loggingInfo = String.format("Root Log Level: %s",
                rootLogger.getLevel());

        log.info(
                CRLFLogConverter.CRLF_SAFE_MARKER,
                """
                        
                        ----------------------------------------------------------
                        \tApplication '{}' is running! Access URLs:
                        \tLocal: \t\t{}://localhost:{}{}
                        \tExternal: \t{}://{}:{}{}
                        \tProfile(s): \t{}
                        \t{}
                        \t{}
                        ----------------------------------------------------------""",
                applicationName,
                protocol,
                serverPort,
                contextPath,
                protocol,
                hostAddress,
                serverPort,
                contextPath,
                environment.getActiveProfiles().length == 0
                        ? environment.getDefaultProfiles()
                        : environment.getActiveProfiles(),
                timezoneInfo,
                loggingInfo
        );
    }
}
