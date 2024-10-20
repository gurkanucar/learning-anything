import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import "../../index.css";

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  socialMedia: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[]; // Handles multiple phone numbers
};

export const MyForm = () => {
  const form = useForm<FormValues>({
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
      <h2>Render count: {renderCount / 2}</h2>
      <form className="my-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: "Username is required",
            })}
          />
          {errors.username && (
            <span className="error-message">{errors.username.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("socialMedia.twitter", {
              required: "Twitter is required",
            })}
          />
          {errors.socialMedia?.twitter && (
            <span className="error-message">
              {errors.socialMedia.twitter.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="text"
            id="facebook"
            {...register("socialMedia.facebook", {
              required: "Facebook is required",
            })}
          />
          {errors.socialMedia?.facebook && (
            <span className="error-message">
              {errors.socialMedia.facebook.message}
            </span>
          )}
        </div>

        {/* Phone Number 1 */}
        <div className="form-group">
          <label htmlFor="phoneNumber1">Phone Number 1</label>
          <input
            type="text"
            id="phoneNumber1"
            {...register("phoneNumbers.0", {
              required: "Phone number 1 is required",
            })}
          />
          {errors?.phoneNumbers?.[0] && (
            <span className="error-message">
              {errors?.phoneNumbers?.[0]?.message}
            </span>
          )}
        </div>

        {/* Phone Number 2 */}
        <div className="form-group">
          <label htmlFor="phoneNumber2">Phone Number 2</label>
          <input
            type="text"
            id="phoneNumber2"
            {...register("phoneNumbers.1", {
              required: "Phone number 2 is required",
            })}
          />
          {errors?.phoneNumbers?.[1] && (
            <span className="error-message">
              {errors?.phoneNumbers?.[1]?.message}
            </span>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
