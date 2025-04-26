package com.gucardev.mailsendingwithmailhog.service;

import com.gucardev.mailsendingwithmailhog.dto.EmailRequest;
import com.gucardev.mailsendingwithmailhog.dto.HtmlEmailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ExampleMailSendingService implements CommandLineRunner {

    private final EmailSenderService emailSenderService;
    private static final String receiver = "receiver-mail-address";

    @Override
    public void run(String... args) throws Exception {
        sendExampleEmails();
    }

    private void sendExampleEmails() {
        // Basic mail
        var emailRequest = new EmailRequest(receiver, "subj", "deneme maili body");
        emailSenderService.sendPlainTextEmail(emailRequest.to(), emailRequest.subject(), emailRequest.body());

        // html reset password template
        var htmlEmailRequest = new HtmlEmailRequest("Reset Password", receiver,
                "password-reset");
        Map<String, Object> model = new HashMap<>();
        model.put("company", "My Company");
        model.put("name", "Ali Ozdemir");
        model.put("reset_link", "https://www.google.com");
        emailSenderService.sendTemplatedHtmlEmail(htmlEmailRequest, model);

        // html otp mail template
        htmlEmailRequest = new HtmlEmailRequest("OTP Verification", receiver, "otp-mail");
        model = new HashMap<>();
        model.put("company", "My Company");
        model.put("name", "Metin Ozdemir");
        model.put("otp_code", 352164);
        emailSenderService.sendTemplatedHtmlEmail(htmlEmailRequest, model);

        // html activate account mail template
        htmlEmailRequest = new HtmlEmailRequest("Activate Account", receiver,
                "activate-account");
        model = new HashMap<>();
        model.put("company", "My Company");
        model.put("name", "Sezai Yalniz");
        model.put("verify_link", "http://localhost:8080/verify/234asd32l32f");
        emailSenderService.sendTemplatedHtmlEmail(htmlEmailRequest, model);

        // welcome mail template
        htmlEmailRequest = new HtmlEmailRequest("Welcome!", receiver, "welcome");
        model = new HashMap<>();
        model.put("company", "My Company");
        model.put("name", "Sezai Yalniz");
        model.put("dashboard_link", "http://localhost:8080/dashboard");
        model.put("guide_link", "https://www.google.com");
        emailSenderService.sendTemplatedHtmlEmail(htmlEmailRequest, model);

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
        emailSenderService.sendTemplatedHtmlEmail(htmlEmailRequest, model);
    }
}

