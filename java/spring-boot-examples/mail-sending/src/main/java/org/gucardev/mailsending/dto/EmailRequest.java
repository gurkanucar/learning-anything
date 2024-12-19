package org.gucardev.mailsending.dto;

public record EmailRequest(String to, String subject, String body) {
}
