package com.gucardev.sqsexample;

import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payload {

    private String id = UUID.randomUUID().toString();
    private String content;
    private String scheduleAt;

}
