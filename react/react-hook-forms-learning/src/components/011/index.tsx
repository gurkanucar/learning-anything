import { useForm, useWatch } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useCallback, useEffect } from "react";
import "../../index.css";

let renderCount = 0;

type FormValues = {
  username: string;
  address: string;
};

function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout>;
  let resolveList: ((value: any) => void)[] = [];

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    clearTimeout(timeout);

    return new Promise((resolve) => {
      resolveList.push(resolve);
      timeout = setTimeout(async () => {
        const result = await func(...args);
        resolveList.forEach((r) => r(result));
        resolveList = [];
      }, wait);
    });
  };
}

export const MyForm = () => {
  const form = useForm<FormValues>({
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log("submitted: ", data);
    reset();
  };

  const username = useWatch({ control, name: "username" });

  const validateUsername = useCallback(
    debounceAsync(async (fieldValue: string) => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?username=${fieldValue}`
        );
        const data = await response.json();

        if (data.length === 0) {
          clearErrors("username");
        } else {
          setError("username", {
            type: "validate",
            message: "Username already exists!",
          });
        }
      } catch (error) {
        setError("username", {
          type: "validate",
          message: "Unable to validate username. Please try again.",
        });
      }
    }, 500),
    [clearErrors, setError]
  );

  useEffect(() => {
    if (username === undefined || username.length < 5) {
      return;
    }
    validateUsername(username);
  }, [username, validateUsername]);

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
              minLength: {
                value: 5,
                message: "Minimum length is 5",
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
              required: "Address is required",
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
