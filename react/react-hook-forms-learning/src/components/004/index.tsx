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
      <h2>Render count:{renderCount / 2}</h2>
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
              required: "twitter is required",
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

        <button type="submit">Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
