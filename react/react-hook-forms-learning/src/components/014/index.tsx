import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

let renderCount = 0;

type FormValues = {
  username: string;
  dateOfBirth: string;
  acceptTerms: boolean;
  gender: "male" | "female" | "other";
  hobbies: { hobby: string }[];
  country: string;
  profilePicture: FileList;
  satisfactionLevel: number;
  newsletter: boolean;
};

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Min 3 length required" })
    .nonempty({ message: "Username is required" }),
  dateOfBirth: z
    .string()
    .nonempty({ message: "Date of birth is required" })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  hobbies: z
    .array(
      z.object({
        hobby: z.string().nonempty({ message: "Hobby is required" }),
      })
    )
    .min(1, { message: "At least one hobby is required" }),
  country: z.string().nonempty({ message: "Country is required" }),
  profilePicture: z.any().refine((files) => files && files.length === 1, {
    message: "Profile picture is required",
  }),
  satisfactionLevel: z
    .number()
    .min(0, { message: "Minimum value is 0" })
    .max(100, { message: "Maximum value is 100" }),
  newsletter: z.boolean(),
});

export const MyForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      hobbies: [{ hobby: "" }],
      newsletter: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "hobbies",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("submitted: ", data);
  };

  renderCount++;

  return (
    <div className="form-container">
      <h2>Render count: {Math.floor(renderCount / 2)}</h2>
      <form className="my-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register("username")} />
          {errors.username && (
            <span className="error-message">{errors.username.message}</span>
          )}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input type="date" id="dateOfBirth" {...register("dateOfBirth")} />
          {errors.dateOfBirth && (
            <span className="error-message">{errors.dateOfBirth.message}</span>
          )}
        </div>

        {/* Accept Terms */}
        <div className="form-group-checkbox">
          <label>
            <input type="checkbox" {...register("acceptTerms")} />
            Accept Terms and Conditions
          </label>
          {errors.acceptTerms && (
            <span className="error-message">{errors.acceptTerms.message}</span>
          )}
        </div>

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>
          <div className="radio-group">
            <label>
              <input type="radio" value="male" {...register("gender")} />
              Male
            </label>
            <label>
              <input type="radio" value="female" {...register("gender")} />
              Female
            </label>
            <label>
              <input type="radio" value="other" {...register("gender")} />
              Other
            </label>
          </div>
          {errors.gender && (
            <span className="error-message">{errors.gender.message}</span>
          )}
        </div>

        {/* Hobbies (Dynamic Fields) */}
        <div className="form-group">
          <label>Hobbies</label>
          {fields.map((field, index) => (
            <div className="form-group-dynamic" key={field.id}>
              <input
                type="text"
                {...register(`hobbies.${index}.hobby` as const)}
                placeholder="Enter hobby"
              />
              {errors.hobbies?.[index]?.hobby && (
                <span className="error-message">
                  {errors.hobbies[index]?.hobby?.message}
                </span>
              )}
              {fields.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => remove(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-hobby-btn"
            onClick={() => append({ hobby: "" })}
          >
            Add Hobby
          </button>
          {errors.hobbies && (
            <span className="error-message">{errors.hobbies.message}</span>
          )}
        </div>

        {/* Country (Select Input) */}
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select id="country" {...register("country")}>
            <option value="">Select country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
            {/* Add more countries as needed */}
          </select>
          {errors.country && (
            <span className="error-message">{errors.country.message}</span>
          )}
        </div>

        {/* Profile Picture (File Input) */}
        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            {...register("profilePicture")}
          />
          {errors.profilePicture && (
            <span className="error-message">
              {errors.profilePicture.message}
            </span>
          )}
        </div>

        {/* Satisfaction Level (Slider) */}
        <div className="form-group">
          <label htmlFor="satisfactionLevel">Satisfaction Level</label>
          <input
            type="range"
            id="satisfactionLevel"
            min="0"
            max="100"
            {...register("satisfactionLevel", { valueAsNumber: true })}
          />
          {errors.satisfactionLevel && (
            <span className="error-message">
              {errors.satisfactionLevel.message}
            </span>
          )}
        </div>

        {/* Newsletter Subscription (Switch) */}
        <div className="form-group-switch">
          <label className="toggle-switch">
            <input type="checkbox" {...register("newsletter")} />
            <span className="toggle-slider"></span>
          </label>
          <span>Subscribe to newsletter</span>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
