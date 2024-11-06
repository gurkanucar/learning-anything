package com.gucardev.sqsexample;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;

import java.util.UUID;

import software.amazon.awssdk.services.scheduler.SchedulerClient;
import software.amazon.awssdk.services.scheduler.model.*;

@Service
@Slf4j
public class EventBridgeService {

    public void createOneTimeSchedule(Payload payload) {
        final SchedulerClient client = SchedulerClient.builder()
                .region(Region.US_EAST_1)
                .build();
        Target sqsTarget = Target.builder()
                .roleArn("arn:aws:iam::")
                .arn("arn:aws:sqs:")
                .input(new Gson().toJson(payload))
                .build();

        CreateScheduleRequest createScheduleRequest = CreateScheduleRequest.builder()
                .name(payload.getId())
//                .scheduleExpression("at(2024-11-06T16:33:00)")
                .scheduleExpression(payload.getScheduleAt())
                .target(sqsTarget)
                .flexibleTimeWindow(FlexibleTimeWindow.builder()
                        .mode(FlexibleTimeWindowMode.OFF)
                        .build())
                .actionAfterCompletion(ActionAfterCompletion.DELETE)
                .build();

        client.createSchedule(createScheduleRequest);
        log.info("Schedule created and will be deleted after completion.");
    }
}

