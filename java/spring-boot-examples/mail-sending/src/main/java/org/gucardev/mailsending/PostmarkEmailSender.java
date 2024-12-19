package org.gucardev.mailsending;

import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostmarkEmailSender {

  @Value("${postmark.apiKey}")
  private String apiKey;

  @Value("${mail.address}")
  private String mailAddress;

  private final PostmarkClient postmarkClient;

  public void sendEmail(String to, String subject, String body) {
    Map<String, Object> emailPayload = new HashMap<>();
    emailPayload.put("From", mailAddress);
    emailPayload.put("To", to);
    emailPayload.put("Subject", subject);
    emailPayload.put("HtmlBody", body);

    postmarkClient.sendEmail(
        "application/json",
        "application/json",
        apiKey,
        emailPayload
    );
  }

}
