# Comprehensive Guide to React Hook Form

## Examples

- 001: Basics (Form, Submission)
- 002: Validations & Error Messages
- 003: Default Values
- 004: Nested Objects
- 005: Array Fields
- 006: Dynamic Array Fields
- 007: Date and Number Inputs
- 008: Watch Functionality
- 009: SetField, GetField, and Disabled Features
- 010: Form Reset and Form States (isLoading, isDirty, isValid)
- 012: Async validation and manually triggering fields
- 013: Zod form validation added
- 014: Different input type examples added
  
  
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
  - [Watch Functionality](#watch-functionality)
  - [SetField, GetField, and Disabled Features](#setfield-getfield-and-disabled-features)
  - [Form Reset and Form States](#form-reset-and-form-states)
    - [Important Form States](#important-form-states)
    - [Form Reset Functionality](#form-reset-functionality)
    - [Form Mode Options](#form-mode-options)
    - [Error Handling](#error-handling)
  - [Async Validation and Manual Validation Trigger](#async-validation-and-manual-validation-trigger)
    - [Async Validation](#async-validation)
    - [Manual Validation Trigger](#manual-validation-trigger)
    - [Best Practices](#best-practices)
    - [Using with TypeScript](#using-with-typescript)
  - [Schema Validation with Zod](#schema-validation-with-zod)
    - [Setup](#setup)
    - [Basic Implementation](#basic-implementation)
    - [Advanced Zod Validation Schemas](#advanced-zod-validation-schemas)
    - [Custom Validation Methods](#custom-validation-methods)
    - [Error Handling](#error-handling-1)
    - [Best Practices](#best-practices-1)
    - [Common Patterns](#common-patterns)
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
  phoneNumbers: string[]; 
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


## Watch Functionality

React Hook Form provides a powerful `watch` method that allows you to observe changes in form fields. This is useful for creating dynamic forms or performing actions based on field values. Here's an example demonstrating how to use the `watch` functionality:

```tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import "../../index.css";

let renderCount = 0;

type FormValues = {
  username: string;
  address: string;
};

export const WatchForm: React.FC = () => {
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

  // Watch everything in the form
  const watchForm = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      console.log("watching", value);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  // Watch a specific field
  // const watchUsername = watch("username");

  // useEffect(() => {
  //   console.log("username is watching", watchUsername);
  //   return () => {};
  // }, [watchUsername]);

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
```

This example demonstrates several ways to use the `watch` functionality:

1. **Watching the entire form:**
   ```tsx
   const watchForm = watch();
   ```
   This creates a snapshot of all form values, which updates on every change.

2. **Using a subscription to watch all changes:**
   ```tsx
   useEffect(() => {
     const subscription = watch((value) => {
       console.log("watching", value);
     });
     return () => {
       subscription.unsubscribe();
     };
   }, [watch]);
   ```
   This sets up a subscription that logs all form changes. It's important to unsubscribe in the cleanup function to prevent memory leaks.

3. **Watching a specific field:**
   ```tsx
   const watchUsername = watch("username");

   useEffect(() => {
     console.log("username is watching", watchUsername);
   }, [watchUsername]);
   ```
   This watches changes to a specific field (commented out in the example).

Key points about `watch`:
- It can be used to create dependent fields or perform side effects based on field values.
- Watching fields can impact performance, especially in large forms, so use it judiciously.
- The `watch` method is reactive, meaning it will cause re-renders when watched values change.

Remember that excessive use of `watch` can lead to performance issues, so it's important to use it strategically and only when necessary.

## SetField, GetField, and Disabled Features

React Hook Form provides methods to programmatically get and set field values, as well as disable fields based on conditions. Here's an example demonstrating these features:

```tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import "../../index.css";

let renderCount = 0;

type FormValues = {
  username: string;
  address: string;
};

export const AdvancedForm: React.FC = () => {
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
      <h2>Render count: {renderCount / 2}</h2>
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
                message: "Minimum length is 15 characters",
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
              disabled: watch("username") !== "admin",
              required: "Address is required",
            })}
          />
          {errors.address && (
            <span className="error-message">{errors.address.message}</span>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>
      <button style={{ margin: 10 }} onClick={handleGetValues} type="button">
        Get Values
      </button>
      <button style={{ margin: 10 }} onClick={handleSetValues} type="button">
        Set Values
      </button>
      <button
        style={{ margin: 10 }}
        onClick={() => setShouldDisable(!shouldDisable)}
        type="button"
      >
        Set disable {!shouldDisable ? "true" : "false"}
      </button>
      <DevTool control={control} />
    </div>
  );
};
```

Let's break down the key features:

1. **GetField (getValues):**
   ```tsx
   const handleGetValues = () => {
     const allValues = getValues();
     const specificValues = getValues(["username"]);
     console.log("get values", allValues, " | specific values", specificValues);
   };
   ```
   - `getValues()` retrieves all form values.
   - `getValues(["username"])` retrieves the value of a specific field.

2. **SetField (setValue):**
   ```tsx
   const handleSetValues = () => {
     setValue("username", getValues("username") + "_UPDATED", {
       shouldValidate: true,
       shouldDirty: true,
       shouldTouch: true,
     });
   };
   ```
   - `setValue()` sets the value of a specific field.
   - Options like `shouldValidate`, `shouldDirty`, and `shouldTouch` control side effects of setting the value.

3. **Disabled Fields:**
   ```tsx
   {...register("username", {
     disabled: shouldDisable,
     // other options...
   })}
   ```
   - The `disabled` option in `register` can be set to a boolean or a function.
   - In this example, it's controlled by a state variable `shouldDisable`.

4. **Conditional Disabling:**
   ```tsx
   {...register("address", {
     disabled: watch("username") !== "admin",
     // other options...
   })}
   ```
   - The `address` field is disabled unless the `username` is "admin".
   - This uses the `watch` function to reactively update the disabled state.

5. **Toggle Disable State:**
   ```tsx
   <button
     onClick={() => setShouldDisable(!shouldDisable)}
     type="button"
   >
     Set disable {!shouldDisable ? "true" : "false"}
   </button>
   ```
   - This button toggles the `shouldDisable` state, affecting the `username` field.

These features allow for more dynamic and interactive forms:
- `getValues` is useful for retrieving form data without submission.
- `setValue` allows programmatic updates to form fields.
- The `disabled` option provides a way to conditionally enable/disable fields based on form state or external factors.

Remember that while these features are powerful, they should be used judiciously to maintain form simplicity and performance.

## Form Reset and Form States

React Hook Form provides various form states and reset functionality that help manage form lifecycle and user interactions effectively. Here's an example demonstrating these features:

```tsx
import { FieldErrors, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import "../../index.css";

type FormValues = {
  username: string;
  address: string;
};

export const MyForm = () => {
  const form = useForm<FormValues>({
    mode: "onChange", // Validate on change instead of on submit
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = form;

  const onSubmit = async (data: FormValues) => {
    console.log("submitted: ", data);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
    window.alert("Form submitted successfully!");
    reset(); // Reset form after successful submission
  };

  const onError = (data: FieldErrors<FormValues>) => {
    console.log("errors", data);
  };

  const handleReset = () => {
    reset(); // Manual form reset
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      {/* Form fields... */}
      <button
        type="submit"
        disabled={!isValid || !isDirty || isSubmitting}
      >
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
      <button
        type="button"
        onClick={handleReset}
        disabled={isSubmitting}
      >
        Reset
      </button>
    </form>
  );
};
```

### Important Form States

React Hook Form provides several form states that help track the form's status:

1. **isDirty**
   - Indicates if any field in the form has been modified
   - Useful for enabling/disabling submit buttons or showing "unsaved changes" warnings
   ```tsx
   const { formState: { isDirty } } = useForm();
   ```

2. **isValid**
   - Returns true if there are no validation errors
   - Often used with `isDirty` to control submit button state
   ```tsx
   const { formState: { isValid } } = useForm();
   ```

3. **isSubmitting**
   - Indicates if the form is currently being submitted
   - Useful for showing loading states and preventing double submissions
   ```tsx
   const { formState: { isSubmitting } } = useForm();
   ```

4. **isSubmitted**
   - Indicates if the form has been submitted
   - Remains true even after a successful submission
   ```tsx
   const { formState: { isSubmitted } } = useForm();
   ```

5. **isSubmitSuccessful**
   - Indicates if the form was submitted successfully
   - Useful for showing success messages or redirecting
   ```tsx
   const { formState: { isSubmitSuccessful } } = useForm();
   ```

### Form Reset Functionality

The `reset` function allows you to clear form values and states:

1. **Basic Reset**
   ```tsx
   const { reset } = useForm();
   reset(); // Resets all fields to their default values
   ```

2. **Reset with Values**
   ```tsx
   reset({
     username: "newUsername",
     address: "newAddress"
   });
   ```

3. **Reset with Options**
   ```tsx
   reset(
     {
       username: "newUsername",
     },
     {
       keepErrors: true, // Keep current validation errors
       keepDirty: true, // Keep dirty/touched state
       keepValues: false, // Don't keep current values
       keepDefaultValues: false, // Don't keep default values
       keepIsSubmitted: false, // Reset submission status
       keepTouched: false, // Reset touched fields
       keepIsValid: false, // Reset validation status
       keepSubmitCount: false // Reset submission counter
     }
   );
   ```

### Form Mode Options

When initializing useForm, you can specify different validation modes:

```tsx
const form = useForm({
  mode: "onChange", // Validate on every change
  // Other options:
  // mode: "onBlur" - Validate when fields are blurred
  // mode: "onSubmit" - Validate only on form submission
  // mode: "onTouched" - Validate after first blur
  // mode: "all" - Validate on all events
});
```

### Error Handling

The form provides two ways to handle submission:

```tsx
// Success and error handlers
const onSubmit = (data: FormValues) => {
  // Handle successful submission
};

const onError = (errors: FieldErrors<FormValues>) => {
  // Handle validation errors
};

// Use both handlers in handleSubmit
<form onSubmit={handleSubmit(onSubmit, onError)}>
```

These features allow you to create more responsive and user-friendly forms by:
- Preventing premature submissions
- Showing appropriate loading states
- Handling form resets effectively
- Managing form validation states
- Providing clear feedback to users

Remember to choose appropriate form states and reset options based on your specific use case and user experience requirements.

## Async Validation and Manual Validation Trigger

React Hook Form supports asynchronous validation and manual validation triggering, allowing you to handle complex validation scenarios like checking username availability or validating against an API.

```tsx
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect, useState } from "react";

type FormValues = {
  username: string;
  address: string;
};

// Mock async validation function
const validateUsername = async (username: string) => {
  return new Promise<string | true>((resolve) => {
    setTimeout(() => {
      if (username !== "validUsername") {
        resolve("Username is not available");
      } else {
        resolve(true);
      }
    }, 1000);
  });
};

export const MyForm = () => {
  const form = useForm<FormValues>({
    mode: "onBlur", // Validate on field blur
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log("submitted: ", data);
  };

  const handleManualValidation = () => {
    trigger(); // Trigger validation for all fields
    // trigger("address") // Trigger validation for a specific field
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input
        {...register("username", {
          required: "Username is required",
          minLength: {
            value: 5,
            message: "Minimum value is 5",
          },
          validate: async (value) => await validateUsername(value),
        })}
      />
      {/* Rest of the form... */}
      <button type="button" onClick={handleManualValidation}>
        Validate Manually
      </button>
    </form>
  );
};
```

### Async Validation

React Hook Form supports asynchronous validation through the `validate` option:

1. **Basic Async Validation**
   ```tsx
   {...register("username", {
     validate: async (value) => {
       const result = await validateUsername(value);
       return result === true || result;
     }
   })}
   ```

2. **Multiple Async Validations**
   ```tsx
   {...register("username", {
     validate: {
       availability: async (value) => await validateUsername(value),
       format: async (value) => {
         const isValid = await checkUsernameFormat(value);
         return isValid || "Invalid username format";
       }
     }
   })}
   ```

3. **Handling Loading States**
   ```tsx
   const { formState: { isValidating } } = useForm();
   
   // Show loading indicator while validating
   {isValidating && <span>Checking username...</span>}
   ```

### Manual Validation Trigger

The `trigger` function allows you to manually initiate validation:

1. **Trigger All Fields**
   ```tsx
   const { trigger } = useForm();
   
   // Validate all fields
   const handleValidate = () => {
     trigger();
   };
   ```

2. **Trigger Specific Fields**
   ```tsx
   // Validate single field
   trigger("username");
   
   // Validate multiple fields
   trigger(["username", "address"]);
   ```

3. **Async Trigger Usage**
   ```tsx
   const handleValidate = async () => {
     const result = await trigger();
     if (result) {
       console.log("All fields are valid");
     }
   };
   ```

### Best Practices

1. **Error Handling**
   - Always return `true` for successful validation
   - Return error message string for failed validation
   ```tsx
   validate: async (value) => {
     try {
       const result = await validateUsername(value);
       return result || "Validation failed";
     } catch (error) {
       return "Error occurred during validation";
     }
   }
   ```

2. **Debouncing**
   - Consider debouncing async validations for better performance
   ```tsx
   import { debounce } from 'lodash';
   
   const debouncedValidation = debounce(validateUsername, 500);
   
   {...register("username", {
     validate: async (value) => await debouncedValidation(value)
   })}
   ```

3. **Conditional Validation**
   - Combine async validation with conditions
   ```tsx
   validate: async (value) => {
     if (value.length < 5) return true; // Skip async validation
     return await validateUsername(value);
   }
   ```

### Using with TypeScript

TypeScript provides type safety for validation functions:

```tsx
type ValidationResult = string | true | Promise<string | true>;

const validateUsername = async (value: string): Promise<ValidationResult> => {
  // Validation logic
};

{...register("username", {
  validate: validateUsername
})}
```

Remember:
- Async validation runs after all sync validations pass
- The form submission will wait for async validations to complete
- Use appropriate loading states to improve user experience
- Consider caching validation results for better performance
- Use manual trigger sparingly and prefer built-in validation modes when possible

These features allow you to create sophisticated validation flows while maintaining good user experience. Choose the appropriate validation strategy based on your specific requirements and performance considerations.

## Schema Validation with Zod

React Hook Form can be integrated with Zod for robust schema validation. This provides type safety and powerful validation capabilities.

### Setup

First, install the required dependencies:

```bash
pnpm install zod @hookform/resolvers
```

### Basic Implementation

Here's how to implement form validation using Zod:

```tsx
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the validation schema
const formSchema = z.object({
  username: z
    .string()
    .min(15, "Username must be at least 15 characters long")
    .min(1, "Username is required"),
  address: z.string().optional(),
});

// Infer TypeScript type from schema
type FormValues = z.infer<typeof formSchema>;

export const MyForm = () => {
  const form = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema), // Connect Zod schema
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" {...register("username")} />
        {errors.username && (
          <span className="error-message">{errors.username.message}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input type="text" id="address" {...register("address")} />
        {errors.address && (
          <span className="error-message">{errors.address.message}</span>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Advanced Zod Validation Schemas

Here are more examples of Zod validation patterns:

```tsx
const advancedFormSchema = z.object({
  // String validations
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),

  // Email validation
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),

  // Number validation
  age: z
    .number()
    .min(18, "Must be at least 18 years old")
    .max(100, "Age cannot exceed 100"),

  // Optional fields
  website: z
    .string()
    .url("Must be a valid URL")
    .optional(),

  // Custom error messages
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),

  // Nested objects
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z.string().regex(/^\d{5}$/, "Invalid zip code"),
  }),

  // Arrays
  phoneNumbers: z
    .array(z.string().regex(/^\d{10}$/, "Invalid phone number"))
    .min(1, "At least one phone number is required"),
});
```

### Custom Validation Methods

You can combine Zod with custom validation:

```tsx
const formSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .refine(async (value) => {
      // Custom async validation
      const isAvailable = await checkUsernameAvailability(value);
      return isAvailable;
    }, "Username is already taken"),
});
```

### Error Handling

Zod provides detailed error information:

```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  mode: "onChange",
});

// Handling specific error types
const { errors } = form.formState;
if (errors.username?.type === "too_small") {
  // Handle minimum length error
}
```

### Best Practices

1. **Type Safety**
   ```tsx
   // Let TypeScript infer types from schema
   type FormValues = z.infer<typeof formSchema>;
   
   // Use inferred types in form
   const form = useForm<FormValues>({
     resolver: zodResolver(formSchema),
   });
   ```

2. **Reusable Schemas**
   ```tsx
   // Base schema
   const userBaseSchema = z.object({
     username: z.string().min(1),
     email: z.string().email(),
   });

   // Extended schema
   const userFormSchema = userBaseSchema.extend({
     password: z.string().min(8),
   });
   ```

3. **Conditional Validation**
   ```tsx
   const formSchema = z.object({
     paymentType: z.enum(["credit", "bank"]),
     creditCardNumber: z
       .string()
       .regex(/^\d{16}$/)
       .optional()
       .refine((val, ctx) => {
         if (ctx.parent.paymentType === "credit" && !val) {
           return false;
         }
         return true;
       }, "Credit card number is required for credit payment"),
   });
   ```

### Common Patterns

1. **Transform Values**
   ```tsx
   const formSchema = z.object({
     age: z
       .string()
       .transform((val) => parseInt(val, 10))
       .pipe(z.number().min(18)),
   });
   ```

2. **Default Values**
   ```tsx
   const formSchema = z.object({
     newsletter: z
       .boolean()
       .default(false),
     role: z
       .enum(["user", "admin"])
       .default("user"),
   });
   ```

Remember:
- Zod provides both runtime validation and TypeScript type inference
- Use `.optional()` for optional fields instead of making them nullable
- Consider performance implications of complex validation rules
- Leverage Zod's built-in error messages or provide custom ones
- Use transformation methods to clean/format data before validation

This integration provides a powerful way to validate forms while maintaining type safety and providing a great developer experience.


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