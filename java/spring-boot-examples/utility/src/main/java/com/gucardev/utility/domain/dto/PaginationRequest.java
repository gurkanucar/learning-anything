package com.gucardev.utility.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.Locale;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Pagination request containing page, size, sorting, and filtering details.")
public class PaginationRequest {

  @Schema(
      description = "The page number to retrieve, starting from 0.",
      example = "0",
      type = "integer",
      minimum = "0"
  )
  @Min(0)
  private int page = 0;

  @Schema(
      description = "The number of records per page.",
      example = "10",
      type = "integer",
      minimum = "1",
      maximum = "1000"
  )
  @Min(1)
  @Max(1000)
  private int size = 10;

  @Schema(
      description = "The field to sort by.",
      example = "name",
      type = "string"
  )
  @NotNull
  private String sortField = "id";

  @Schema(
      description = "The sort direction, either 'ASC' or 'DESC'.",
      example = "ASC",
      type = "string",
      allowableValues = {"ASC", "DESC"}
  )
  @NotNull
  @Pattern(regexp = "^(ASC|DESC|asc|desc)$", message = "{sort.direction.pattern.exception}")
  private String sortDirection = "ASC";

  @Schema(
      description = "Field to filter/search by.",
      example = "name",
      type = "string"
  )
  @NotNull
  private String searchField = "";


  public @NotNull @Pattern(regexp = "^(ASC|DESC|asc|desc)$",
      message = "{sort.direction.pattern.exception}") String getSortDirection() {
    return sortDirection.toUpperCase(Locale.ROOT);
  }
}
