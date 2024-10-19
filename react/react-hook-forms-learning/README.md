## project creation

```bash

pnpm install @emotion/react @emotion/styled @mui/icons-material @mui/material @mui/x-date-pickers @mui/x-date-pickers-pro  @tanstack/react-query axios date-fns@3.2 react-hook-form @hookform/resolvers zod lodash

pnpm install -D @hookform/devtools

```

### folders:
- 001: basics (form, submission)
- 002: validations & error messages





### Add devtool for hook form

```bash
    import { DevTool } from "@hookform/devtools";
    const form = useForm();
    const { register, control } = form;
    <DevTool control={control} />
```

### Implementing hook form

```bash
import { useForm } from "react-hook-form";

export const MyForm = () => {
  const form = useForm();
  const { register } = form;
  const { name, ref, onChange, onBlur } = register("username");

  return (
    <div className="form-container">
      <form className="my-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name={name}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
          />
        </div>

  ...
}

      // instead this we should put like:
        const form = useForm();
        const { register } = form; 
         ...
        <input type="text" id="username" {...register("username")} />

```

### Form submitting:

```bash
type FormValues = {
  username: string;
  email: string;
};

export const MyForm = () => {
  const form = useForm<FormValues>();
  const { register, control, handleSubmit } = form;

  const onSubmit = (data: FormValues) => {
    console.log("submitted: ", data);
  };

  return (
    <div className="form-container">
      <form className="my-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register("username")} />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" {...register("email")} />
        </div>
    ...
```

### Form validations and showing error messages:

```bash
type FormValues = {
  username: string;
  email: string;
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
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>

              <button type="submit">Submit</button>
            </form>
            <DevTool control={control} />
          </div>
```