package com.gucardev.utility;

import com.gucardev.utility.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ExampleController {

    @GetMapping("/success")
    public ApiResponse<Fizz> success() {
        return ApiResponse.<Fizz>builder()
                .payload(new Fizz("field", 5))
                .message("successfully.data.created")
                .status(HttpStatus.OK).build();
    }

}
