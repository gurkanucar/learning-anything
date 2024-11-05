package com.gucardev.utility;

import com.gucardev.utility.response.ApiResponse;
import com.gucardev.utility.response.ApiResponseBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ExampleController {

    private final ApiResponseBuilder apiResponseBuilder;

    @GetMapping("/success")
    public ApiResponse<Fizz> success() {
        return apiResponseBuilder.buildResponse(
                HttpStatus.OK,
                new Fizz("field", 5),
                "successfully.data.created"
        );
    }

}
