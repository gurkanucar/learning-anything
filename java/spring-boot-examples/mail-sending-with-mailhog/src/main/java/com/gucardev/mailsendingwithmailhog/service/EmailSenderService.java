package com.gucardev.mailsendingwithmailhog.service;

import com.gucardev.mailsendingwithmailhog.dto.HtmlEmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailSenderService {

    private final SpringTemplateEngine templateEngine;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@example.com}")
    private String fromEmail;


    public void sendPlainTextEmail(String recipient, String subject, String content) {
        try {
            MimeMessage message = createMimeMessage(recipient, subject, content, false);
            log.info("Sending plain text email to: {}", recipient);
            deliverEmail(message, recipient);
        } catch (MessagingException e) {
            handleEmailError("plain text", recipient, e);
        }
    }

    public void sendTemplatedHtmlEmail(HtmlEmailRequest request, Map<String, Object> modelData) {
        Context context = new Context();
        context.setVariables(modelData);

        String templateName = request.templateName();
        String recipient = request.to();
        String subject = request.subject();

        String processedHtml = templateEngine.process(templateName, context);
        log.debug("Processed HTML template '{}' for recipient: {}", templateName, recipient);
        sendHtmlEmail(recipient, subject, processedHtml);
    }

    private void sendHtmlEmail(String recipient, String subject, String htmlContent) {
        try {
            MimeMessage message = createMimeMessage(recipient, subject, htmlContent, true);
            log.info("Sending HTML email to: {}", recipient);
            deliverEmail(message, recipient);
        } catch (MessagingException e) {
            handleEmailError("HTML", recipient, e);
        }
    }

    private MimeMessage createMimeMessage(String recipient, String subject, String content, boolean isHtml)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(recipient);
        helper.setSubject(subject);
        helper.setText(content, isHtml);

        return message;
    }

    private void deliverEmail(MimeMessage message, String recipient) {
        mailSender.send(message);
        log.info("Email sent successfully to: {}", recipient);
    }

    private void handleEmailError(String emailType, String recipient, MessagingException exception) {
        log.error("Failed to send {} email to: {}", emailType, recipient, exception);
        throw new RuntimeException("Failed to send " + emailType + " email", exception);
    }
}