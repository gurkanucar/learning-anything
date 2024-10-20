# Comprehensive Guide to React Hook Form

## Examples

- 001: Basics (Form, Submission)
- 002: Validations & Error Messages
- 003: Default Values
- 004: Nested Objects
- 005: Array Fields

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
  - [Array Fields](#array-fields)
  - [Dynamic Array Fields](#dynamic-array-fields)
  - [Date and Number Inputs](#date-and-number-inputs)
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

## Array Fields

React Hook Form also supports array fields. Here's an example that includes both nested objects and array fields:

```tsx
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import "../../index.css";

let renderCount = 0;

type FormValues = {
  username: string;
  socialMedia: {
    twitter: string;
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
```

This example demonstrates how to handle nested objects (`socialMedia`) and array fields (`phoneNumbers`) within the same form. It also shows how to use the DevTool for debugging purposes.

## Dynamic Array Fields

React Hook Form also supports dynamic array fields, allowing users to add or remove fields as needed. Here's an example implementation:

```tsx
import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

type FormValues = {
  username: string;
  socialMedia: {
    twitter: string;
  };
  tags: { name: string; value: number }[];
};

export const DynamicArrayForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      tags: [{ name: "", value: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("submitted: ", data);
  };

  return (
    <div className="form-container">
      <form className="my-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Username and Twitter fields remain the same */}
        
        {fields.map((field, index) => (
          <div className="form-group-dynamic" key={field.id}>
            <div className="form-group">
              <label htmlFor={`tag-${field.id}-name`}>Tag Name</label>
              <input
                type="text"
                id={`tag-${field.id}-name`}
                {...register(`tags.${index}.name` as const, {
                  required: "Tag name is required",
                })}
              />
              {errors.tags?.[index]?.name && (
                <span className="error-message">
                  {errors.tags[index]?.name?.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`tag-${field.id}-value`}>Tag Value</label>
              <input
                type="number"
                id={`tag-${field.id}-value`}
                {...register(`tags.${index}.value` as const, {
                  required: "Tag value is required",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "Minimum value is 1",
                  },
                })}
              />
              {errors.tags?.[index]?.value && (
                <span className="error-message">
                  {errors.tags[index]?.value?.message}
                </span>
              )}
            </div>

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

        <div className="form-actions">
          <button
            type="button"
            className="add-tag-btn"
            onClick={() => append({ name: "", value: 0 })}
          >
            Add Tag
          </button>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
      <DevTool control={control} />
    </div>
  );
};
```

This example demonstrates how to:

1. Use `useFieldArray` to manage dynamic array fields.
2. Implement add and remove functionality for array items.
3. Handle validation for dynamic fields.
4. Use the DevTool for debugging dynamic forms.

## Date and Number Inputs

React Hook Form can handle various input types, including date and number inputs. Here's an example that demonstrates how to use date and number inputs, along with setting default date values using date-fns:

```tsx
import React from "react";
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

export const DateNumberForm: React.FC = () => {
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
      <h2>Render count: {renderCount / 2}</h2>
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
```

This example demonstrates how to:

1. Use `type="number"` for age input and `type="date"` for date of birth input.
2. Set a default value for the date input using the current date formatted with date-fns.
3. Use `valueAsNumber` for the age input to ensure it's treated as a number.
4. Handle validation for both number and date inputs.
5. Use the DevTool for debugging the form.

Key points:
- The `getCurrentFormattedDate` function uses date-fns to format the current date in the "YYYY-MM-DD" format required by the date input.
- The `valueAsNumber` option in the age input's registration ensures that the value is treated as a number rather than a string.
- The date input uses the native browser date picker, which can vary in appearance and functionality across different browsers.

Remember to install the date-fns library if you haven't already:

```bash
pnpm install date-fns
```

This example showcases how React Hook Form can easily handle different input types and integrate with utility libraries like date-fns for more complex date handling.

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

[official React Hook Form documentation](https://react-hook-form.com/).