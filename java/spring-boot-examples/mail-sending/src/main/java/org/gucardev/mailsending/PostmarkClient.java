package org.gucardev.mailsending;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "postmarkClient", url = "https://api.postmarkapp.com")
public interface PostmarkClient {

  @PostMapping(value = "/email", consumes = "application/json", produces = "application/json")
  void sendEmail(
      @RequestHeader("Accept") String acceptHeader,
      @RequestHeader("Content-Type") String contentTypeHeader,
      @RequestHeader("X-Postmark-Server-Token") String serverToken,
      @RequestBody Map<String, Object> emailPayload
  );
}
