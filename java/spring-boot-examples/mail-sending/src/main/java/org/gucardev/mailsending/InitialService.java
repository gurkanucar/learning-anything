package org.gucardev.mailsending;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.gucardev.mailsending.dto.EmailRequest;
import org.gucardev.mailsending.dto.HtmlEmailRequest;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class InitialService implements CommandLineRunner {

  private final EmailSenderService emailSenderService;
  private static final String receiver = "receiver-mail-address";

  @Override
  public void run(String... args) throws Exception {

    // Basic mail
    var emailRequest = new EmailRequest(receiver, "subj", "deneme maili body");
    emailSenderService.sendEmail(emailRequest.to(), emailRequest.subject(), emailRequest.body());

    // html reset password template
    var htmlEmailRequest = new HtmlEmailRequest("Reset Password", receiver,
        "password-reset-modern");
    Map<String, Object> model = new HashMap<>();
    model.put("company", "My Company");
    model.put("name", "Ali Ozdemir");
    model.put("reset_link", "https://www.google.com");
    emailSenderService.htmlSend(htmlEmailRequest, model);

    // html otp mail template
    htmlEmailRequest = new HtmlEmailRequest("OTP Verification", receiver, "otp-mail-modern");
    model = new HashMap<>();
    model.put("company", "My Company");
    model.put("name", "Metin Ozdemir");
    model.put("otp_code", 352164);
    emailSenderService.htmlSend(htmlEmailRequest, model);

    // html activate account mail template
    htmlEmailRequest = new HtmlEmailRequest("Activate Account", receiver,
        "activate-account-modern");
    model = new HashMap<>();
    model.put("company", "My Company");
    model.put("name", "Sezai Yalniz");
    model.put("verify_link", "http://localhost:8080/verify/234asd32l32f");
    emailSenderService.htmlSend(htmlEmailRequest, model);

    // welcome mail template
    htmlEmailRequest = new HtmlEmailRequest("Welcome!", receiver, "welcome-modern");
    model = new HashMap<>();
    model.put("company", "My Company");
    model.put("name", "Sezai Yalniz");
    model.put("dashboard_link", "http://localhost:8080/dashboard");
    model.put("guide_link", "https://www.google.com");
    emailSenderService.htmlSend(htmlEmailRequest, model);

    // html template with table
    htmlEmailRequest = new HtmlEmailRequest("subj-table", receiver, "users");
    // Dynamic columns and rows
    List<List<String>> tableData = new ArrayList<>();
    // Adding headers - column1, column2
    tableData.add(Arrays.asList("Name", "Surname"));
    // Adding rows
    tableData.add(Arrays.asList("Ali", "Ozdemir"));
    tableData.add(Arrays.asList("Metin", "Ozdemir"));
    tableData.add(Arrays.asList("Sezai", "Yanliz"));
    model = new HashMap<>();
    model.put("tableData", tableData);
    emailSenderService.htmlSend(htmlEmailRequest, model);
  }
}
