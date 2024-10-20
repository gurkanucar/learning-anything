import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { format } from "date-fns";

import "../../index.css";

let renderCount = 0;

type FormValues = {
  dateOfBirth: string;
  age: number;
};

// Use date-fns to format the date as YYYY-MM-DD
const getCurrentFormattedDate = () => {
  return format(new Date(), "yyyy-MM-dd");
};

export const MyForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      dateOfBirth: getCurrentFormattedDate(), // Set the default to today's formatted date
    },
    mode: "onSubmit",
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log("submitted: ", data);
  };

  renderCount++;
  return (
    <div className="form-container">
      <h2>Render count:{renderCount / 2}</h2>
      <form className="my-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: "Age is required",
            })}
          />
          {errors.age && (
            <span className="error-message">{errors.age.message}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            {...register("dateOfBirth", {
              required: "Date of birth is required",
            })}
          />
          {errors.dateOfBirth && (
            <span className="error-message">{errors.dateOfBirth.message}</span>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
