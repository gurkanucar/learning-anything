package com.gucardev.mailsendingwithmailhog.dto;

public record EmailRequest(String to, String subject, String body) {
}
