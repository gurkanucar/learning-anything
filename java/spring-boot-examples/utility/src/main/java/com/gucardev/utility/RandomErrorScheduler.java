package com.gucardev.utility;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class RandomErrorScheduler {

  private static final Logger logger = LoggerFactory.getLogger(RandomErrorScheduler.class);
  private final Random random = new Random();

  @Async
  @Scheduled(fixedRate = 5000) // Runs every 5 seconds
  public void triggerRandomError() throws Exception {
    logger.info("Scheduler triggered.");
    // Randomly decide whether to throw an exception
    if (random.nextBoolean()) {
      causeNestedException();
    } else {
      logger.info("No exception this time!");
    }
  }

  private void causeNestedException() throws Exception {
    try {
      causeInnerException();
    } catch (RuntimeException e) {
      throw new Exception("Outer exception wrapping an inner exception", e);
    }
  }

  private void causeInnerException() {
    throw new RuntimeException("This is the inner exception.");
  }
}
