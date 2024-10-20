import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import "../../index.css";
import { useEffect } from "react";

let renderCount = 0;

type FormValues = {
  username: string;
  address: string;
};

export const MyForm = () => {
  const form = useForm<FormValues>({
    mode: "onSubmit",
  });

  const {
    watch,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log("submitted: ", data);
  };

  // watch everything in form
  const watchForm = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      console.log("watching", value);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  //watch desired field
  // const watchUsername = watch("username");

  // useEffect(() => {
  //   console.log("username is watching", watchUsername);
  //   return () => {};
  // }, [watchUsername]);

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
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            {...register("address", {
              required: "address is required",
            })}
          />
          {errors.address && (
            <span className="error-message">{errors.address.message}</span>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
