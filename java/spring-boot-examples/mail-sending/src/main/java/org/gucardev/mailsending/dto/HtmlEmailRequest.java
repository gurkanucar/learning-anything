package org.gucardev.mailsending.dto;

public record HtmlEmailRequest(String subject, String to, String name, String templateName) {
}
