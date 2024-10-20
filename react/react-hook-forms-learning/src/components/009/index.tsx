import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import "../../index.css";
import { useEffect, useState } from "react";

let renderCount = 0;

type FormValues = {
  username: string;
  address: string;
};

export const MyForm = () => {
  const [shouldDisable, setShouldDisable] = useState<boolean>(false);

  const form = useForm<FormValues>({
    mode: "onSubmit",
  });

  const {
    watch,
    getValues,
    setValue,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log("submitted: ", data);
  };

  const handleGetValues = () => {
    const allValues = getValues();
    const specificValues = getValues(["username"]);
    console.log("get values", allValues, " | specific values", specificValues);
  };

  const handleSetValues = () => {
    setValue("username", getValues("username") + "_UPDATED", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
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
              disabled: shouldDisable,
              required: "Username is required",
              minLength: {
                value: 15,
                message: "Minimum value is 15",
              },
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
              disabled: watch("username")!=="admin",
              required: "address is required",
            })}
          />
          {errors.address && (
            <span className="error-message">{errors.address.message}</span>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>
      <button style={{ margin: 10 }} onClick={handleGetValues} type="submit">
        Another Button For Get Values
      </button>
      <button style={{ margin: 10 }} onClick={handleSetValues} type="submit">
        Set Values
      </button>
      <button
        style={{ margin: 10 }}
        onClick={() => setShouldDisable(!shouldDisable)}
        type="submit"
      >
        Set disable {!shouldDisable ? "true" : "false"}
      </button>
      <DevTool control={control} />
    </div>
  );
};
