# Comprehensive Guide to React Hook Form

## Examples

- 001: Basics (Form, Submission)
- 002: Validations & Error Messages
- 003: Default Values
- 004: Nested Objects

## Table of Contents
- [Comprehensive Guide to React Hook Form](#comprehensive-guide-to-react-hook-form)
  - [Examples](#examples)
  - [Table of Contents](#table-of-contents)
  - [Project Setup](#project-setup)
  - [Basic Form Implementation](#basic-form-implementation)
  - [Form Submission](#form-submission)
  - [Form Validation and Error Handling](#form-validation-and-error-handling)
  - [Default Values](#default-values)
  - [Nested Objects](#nested-objects)
  - [Advanced Topics](#advanced-topics)
    - [Using DevTools](#using-devtools)
    - [Custom Validation](#custom-validation)

## Project Setup

First, let's set up our project with the necessary dependencies:

```bash
pnpm install @emotion/react @emotion/styled @mui/material @mui/icons-material @mui/x-date-pickers @mui/x-date-pickers-pro @tanstack/react-query axios date-fns@3.2 react-hook-form @hookform/resolvers zod lodash
pnpm install -D @hookform/devtools
```

These packages provide a robust foundation for building forms with React Hook Form, along with UI components, date pickers, and utilities.

## Basic Form Implementation

Let's start with a basic implementation of a form using React Hook Form:

```tsx
import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  username: string;
  email: string;
};

export const BasicForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  //const { name, ref, onChange, onBlur } = register("username");
  
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" {...register("username")} />
        {/* <input type="text" id="username" name={name} ref={ref} onChange={onChange} onBlur={onBlur} /> */}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

In this example, we use the `useForm` hook to create our form. The `register` function is used to register our inputs with the form.

## Form Submission

To handle form submission, we use the `handleSubmit` function provided by React Hook Form:

```tsx
const onSubmit: SubmitHandler<FormValues> = (data) => {
  console.log("Form submitted:", data);
  // Here you can send the data to an API, update state, etc.
};

// In your JSX:
<form onSubmit={handleSubmit(onSubmit)}>
  {/* form fields */}
</form>
```

The `handleSubmit` function wraps your `onSubmit` callback to ensure all validations pass before invoking it.

## Form Validation and Error Handling

React Hook Form provides built-in validation. Here's an example with validation and error messages:

```tsx
import { useForm } from "react-hook-form";

type FormValues = {
  username: string;
  email: string;
};

export const ValidatedForm: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormValues>({
    mode: "onBlur" // Validate on blur
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters long"
            }
          })}
        />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

This example shows how to add validation rules and display error messages.

## Default Values

You can set default values for your form fields:

```tsx
const { register, handleSubmit } = useForm<FormValues>({
  defaultValues: {
    username: "defaultUser",
    email: "default@example.com"
  }
});
```

For asynchronous default values:

```tsx
const { register, handleSubmit } = useForm<FormValues>({
  defaultValues: async () => {
    const response = await fetch("https://api.example.com/user");
    const data = await response.json();
    return {
      username: data.username,
      email: data.email
    };
  }
});
```

## Nested Objects

React Hook Form supports nested object structures:

```tsx
type FormValues = {
  username: string;
  email: string;
  social: {
    twitter: string;
    facebook: string;
  };
};

export const NestedForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} />
      <input {...register("email")} />
      <input {...register("social.twitter")} />
      <input {...register("social.facebook")} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

Use dot notation in the `register` function to handle nested fields.

## Advanced Topics

### Using DevTools

For debugging, you can use the React Hook Form DevTools:

```tsx
import { DevTool } from "@hookform/devtools";

export const FormWithDevTools: React.FC = () => {
  const { control } = useForm();
  
  return (
    <>
      <form>{/* ... */}</form>
      <DevTool control={control} />
    </>
  );
};
```

### Custom Validation

You can create custom validation rules:

```tsx
const { register } = useForm<FormValues>();

<input
  {...register("username", {
    validate: (value) => value !== "admin" || "Username cannot be 'admin'"
  })}
/>
```
 [react-hook-form.com](https://react-hook-form.com/).