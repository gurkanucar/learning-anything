import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect, useState } from "react";
import "../../index.css";

let renderCount = 0;

type FormValues = {
  username: string;
  address: string;
};

// Mock async validation function
const validateUsername = async (username: string) => {
  return new Promise<string | true>((resolve) => {
    setTimeout(() => {
      if (username !== "validUsername") {
        resolve("Username is not available");
      } else {
        resolve(true); 
      }
    }, 1000);
  });
};

export const MyForm = () => {
  const form = useForm<FormValues>({
    mode: "onBlur",
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log("submitted: ", data);
  };

  const handleManualValidation = () => {
    trigger(); // Manually trigger validation for all fields
    // trigger("address") // trigger field by name
  };

  renderCount++;
  return (
    <div className="form-container">
      <h2>Render count:{renderCount / 2}</h2>
      <form className="my-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 5,
                message: "Minimum value is 5",
              },
              validate: async (value) => await validateUsername(value),
            })}
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
          />
          {errors.address && (
            <span className="error-message">{errors.address.message}</span>
          )}
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleManualValidation}>
          Validate Manually
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
