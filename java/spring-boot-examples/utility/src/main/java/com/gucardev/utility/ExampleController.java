package com.gucardev.utility;

import com.gucardev.utility.infrastructure.exception.ExceptionMessage;
import com.gucardev.utility.infrastructure.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.gucardev.utility.infrastructure.exception.helper.ExceptionUtil.buildException;

@Tag(name = "example controller name")
@RestController
@RequestMapping
@RequiredArgsConstructor
public class ExampleController {

    @Operation(summary = "it returns success", description = "it will return success")
    @GetMapping("/success")
    public ApiResponse<Fizz> success() {
        return ApiResponse.<Fizz>builder()
                .payload(new Fizz("field", 5))
                .message("successfully.data.created")
                .status(HttpStatus.OK).build();
    }


    @GetMapping("/retrieve/not-existing-user/{id}")
    public void error(@PathVariable Integer id) {
        throw buildException(ExceptionMessage.NOT_FOUND_EXCEPTION, id);
    }


    @GetMapping("/retrieve/not-existing-user-runtime-ex/{id}")
    public void runtimeException(@PathVariable Integer id) {
        throw new RuntimeException("exception: " + id);
    }

    @PostMapping("/validation-ex")
    ResponseEntity<?> notFoundUserException(@Valid @RequestBody Address address) {
        return ResponseEntity.ok(address);
    }

    @Getter
    @Setter
    public static class Address {
        @NotBlank
        private String street;
        @NotBlank
        private String city;
        @Length(min = 5, max = 7)
        private String title;
    }

}
