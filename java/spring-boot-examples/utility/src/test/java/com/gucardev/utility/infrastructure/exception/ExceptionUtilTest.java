package com.gucardev.utility.infrastructure.exception;

import com.gucardev.utility.infrastructure.exception.helper.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
public class ExceptionUtilTest {

  @Test
  public void testGetFilteredStackTrace() {
    try {
      simulateNestedExceptions();
      fail("An exception should have been thrown");
    } catch (Exception e) {
      // Use the utility method to get the filtered stack trace
      String filteredStackTrace = ExceptionUtil.getFilteredStackTrace(e);
      log.info("Filtered Stack Trace:");
      log.info(filteredStackTrace);

      // Assert that the filtered stack trace is not null or empty
      assertNotNull(filteredStackTrace, "Filtered stack trace should not be null");
      assertFalse(filteredStackTrace.isEmpty(), "Filtered stack trace should not be empty");

      // Optionally, check that the stack trace contains certain expected messages
      assertTrue(filteredStackTrace.contains("Service layer exception"), "Should contain 'Service layer exception'");
      assertTrue(filteredStackTrace.contains("Database exception"), "Should contain 'Database exception'");
      assertTrue(filteredStackTrace.contains("Root cause exception"), "Should contain 'Root cause exception'");
    }
  }

  private void simulateNestedExceptions() throws ServiceException {
    try {
      databaseOperation();
    } catch (DatabaseException e) {
      throw new ServiceException("Service layer exception", e);
    }
  }

  private void databaseOperation() throws DatabaseException {
    try {
      dataAccessOperation();
    } catch (DataAccessException e) {
      throw new DatabaseException("Database exception", e);
    }
  }

  private void dataAccessOperation() throws DataAccessException {
    throw new DataAccessException("Root cause exception");
  }

  // Custom exception classes to simulate different layers
  class ServiceException extends Exception {
    public ServiceException(String message, Throwable cause) {
      super(message, cause);
    }
  }

  class DatabaseException extends Exception {
    public DatabaseException(String message, Throwable cause) {
      super(message, cause);
    }
  }

  class DataAccessException extends Exception {
    public DataAccessException(String message) {
      super(message);
    }
  }
}
