package com.gucardev.utility;

import static com.gucardev.utility.infrastructure.exception.helper.ExceptionUtil.buildException;

import com.gucardev.utility.infrastructure.exception.ExceptionMessage;
import com.gucardev.utility.infrastructure.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Example Controller", description = "Controller demonstrating API operations and exception handling")
@RestController
@RequestMapping
@RequiredArgsConstructor
public class ExampleController {

  @Operation(
      summary = "Get success response",
      description = "This endpoint returns a successful response with a sample payload."
  )
  @GetMapping("/success")
  public ApiResponse<Fizz> success() {
    return ApiResponse.<Fizz>builder()
        .payload(new Fizz("field", 5))
        .message("successfully.data.created")
        .status(HttpStatus.OK).build();
  }

  @Operation(
      summary = "Retrieve non-existing user",
      description = "Throws a custom exception when trying to retrieve a non-existing user.",
      parameters = {
          @Parameter(name = "id", description = "ID of the user to retrieve", example = "123")
      }
  )
  @GetMapping("/retrieve/not-existing-user/{id}")
  public void error(@PathVariable Integer id) {
    throw buildException(ExceptionMessage.NOT_FOUND_EXCEPTION, id);
  }

  @Operation(
      summary = "Throw runtime exception",
      description = "Throws a generic runtime exception for demonstration purposes.",
      parameters = {
          @Parameter(name = "id", description = "ID to demonstrate the exception", example = "123")
      }
  )
  @GetMapping("/retrieve/not-existing-user-runtime-ex/{id}")
  public void runtimeException(@PathVariable Integer id) {
    throw new RuntimeException("exception: " + id);
  }

  @Operation(
      summary = "Validate and create address",
      description = "Validates the provided address and returns it in the response.",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "Address object to validate",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = Address.class)
          )
      )
  )
  @PostMapping("/validation-ex")
  public ResponseEntity<Address> notFoundUserException(@Valid @RequestBody Address address) {
    return ResponseEntity.ok(address);
  }
}
