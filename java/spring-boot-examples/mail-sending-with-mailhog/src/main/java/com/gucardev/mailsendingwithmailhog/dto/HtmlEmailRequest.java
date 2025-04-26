package com.gucardev.mailsendingwithmailhog.dto;

public record HtmlEmailRequest(String subject, String to, String templateName) {
}
