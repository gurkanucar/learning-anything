package com.gucardev.utility.domain;

import static com.gucardev.utility.infrastructure.exception.helper.ExceptionUtil.buildException;

import com.gucardev.utility.domain.dto.Address;
import com.gucardev.utility.domain.dto.Fizz;
import com.gucardev.utility.domain.dto.PaginationRequest;
import com.gucardev.utility.infrastructure.constants.Constants;
import com.gucardev.utility.infrastructure.exception.ExceptionMessage;
import com.gucardev.utility.infrastructure.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        .payload(new Fizz(Constants.API_BASE_URL, 5))
        .message("successfully.data.created")
        .status(HttpStatus.OK).build();
  }

  @Operation(
      summary = "Get paginated data",
      description = "This endpoint returns paginated data based on the provided request parameters."
  )
  @GetMapping("/paginate")
  public ApiResponse<Map<String, Object>> getPaginatedData(
      @Valid @ParameterObject PaginationRequest paginationRequest) {
    PageRequest pageRequest = PageRequest.of(
        paginationRequest.getPage(),
        paginationRequest.getSize(),
        Sort.by(Sort.Direction.fromString(paginationRequest.getSortDirection()),
            paginationRequest.getSortField())
    );
    // Mock implementation: Replace with actual service/repository logic
    Map<String, Object> responseData = Map.of(
        "paginationRequest", pageRequest,
        "searchField", paginationRequest.getSearchField()
    );
    return ApiResponse.<Map<String, Object>>builder()
        .payload(responseData)
        .message("Paginated data fetched successfully.")
        .status(HttpStatus.OK)
        .build();
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
