package com.gucardev.utility.infrastructure.config;

import com.gucardev.utility.infrastructure.util.CRLFLogConverter;
import io.micrometer.common.util.StringUtils;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


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
    log.info(
        CRLFLogConverter.CRLF_SAFE_MARKER,
        """
            
            ----------------------------------------------------------
            \tApplication '{}' is running! Access URLs:
            \tLocal: \t\t{}://localhost:{}{}
            \tExternal: \t{}://{}:{}{}
            \tProfile(s): \t{}
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
            : environment.getActiveProfiles()
    );
  }
}
