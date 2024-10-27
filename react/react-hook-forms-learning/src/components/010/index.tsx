import { FieldErrors, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import "../../index.css";

let renderCount = 0;

type FormValues = {
  username: string;
  address: string;
};

export const MyForm = () => {
  const form = useForm<FormValues>({
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = form;

  const onSubmit = async (data: FormValues) => {
    console.log("submitted: ", data);

    // Simulate a 2-second delay to mimic async operation
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    // Show success alert after submission completes
    window.alert("Form submitted successfully!");

    // Automatically reset the form after successful submission
    reset();
  };

  const onError = (data: FieldErrors<FormValues>) => {
    console.log("errors", data);
  };

  // Manual reset button handler
  const handleReset = () => {
    reset(); // This will reset the form fields manually
  };

  renderCount++;

  return (
    <div className="form-container">
      <h2>Render count: {renderCount / 2}</h2>
      <form
        className="my-form"
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 15,
                message: "Minimum value is 15",
              },
            })}
            disabled={isSubmitting}
          />
          {errors.username && (
            <span className="error-message">{errors.username.message}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            {...register("address", {
              required: "Address is required",
            })}
            disabled={isSubmitting}
          />
          {errors.address && (
            <span className="error-message">{errors.address.message}</span>
          )}
        </div>

        <div className="form-actions">
          {/* Submit button */}
          <button
            type="submit"
            disabled={!isValid || !isDirty || isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? "Loading..." : "Submit"}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="reset-btn"
          >
            Reset
          </button>
        </div>
      </form>
      <DevTool control={control} />
    </div>
  );
};
