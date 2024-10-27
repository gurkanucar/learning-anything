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
- 
## Table of Contents

- [Comprehensive Guide to React Hook Form](#comprehensive-guide-to-react-hook-form)
  - [Examples](#examples)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
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
  - [Programmatic Field Manipulation](#programmatic-field-manipulation)
  - [Form Reset and Form States](#form-reset-and-form-states)
    - [Important Form States](#important-form-states)
    - [Form Reset Functionality](#form-reset-functionality)
    - [Form Mode Options](#form-mode-options)
    - [Error Handling](#error-handling)
  - [Async Validation and Manual Trigger](#async-validation-and-manual-trigger)
    - [Best Practices](#best-practices)
  - [Schema Validation with Zod](#schema-validation-with-zod)
    - [Setup](#setup)
    - [Basic Implementation](#basic-implementation)
    - [Advanced Zod Validation Schemas](#advanced-zod-validation-schemas)
    - [Custom Validation Methods](#custom-validation-methods)
  - [Advanced Topics](#advanced-topics)
    - [Using DevTools](#using-devtools)
    - [Custom Validation](#custom-validation)
  - [References](#references)

## Introduction

This guide provides a comprehensive overview of using React Hook Form with TypeScript, covering basic to advanced functionalities for efficient form handling in React applications.

## Project Setup

Install the necessary dependencies:

```bash
pnpm install @emotion/react @emotion/styled @mui/material @mui/icons-material @mui/x-date-pickers @mui/x-date-pickers-pro @tanstack/react-query axios date-fns@3.2 react-hook-form @hookform/resolvers zod lodash
pnpm install -D @hookform/devtools
```

These packages include React Hook Form, TypeScript support, UI components, date pickers, and validation utilities.

## Basic Form Implementation

```tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  username: string;
  email: string;
};

export const BasicForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Username</label>
        <input {...register('username')} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" {...register('email')} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Form Submission

Handle form submission using the `handleSubmit` function:

```tsx
const onSubmit: SubmitHandler<FormValues> = (data) => {
  console.log('Form submitted:', data);
};

<form onSubmit={handleSubmit(onSubmit)}>
  {/* Form fields */}
</form>
```

## Form Validation and Error Handling

Add validation rules and display error messages:

```tsx
import { useForm } from 'react-hook-form';

type FormValues = {
  username: string;
  email: string;
};

export const ValidatedForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    mode: 'onBlur',
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label>Username</label>
        <input
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'Must be at least 3 characters' },
          })}
        />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Default Values

Set default values for your form fields:

```tsx
const { register, handleSubmit } = useForm<FormValues>({
  defaultValues: {
    username: 'defaultUser',
    email: 'default@example.com',
  },
});
```

For asynchronous default values:

```tsx
const { register, handleSubmit } = useForm<FormValues>({
  defaultValues: async () => {
    const response = await fetch('https://api.example.com/user');
    const data = await response.json();
    return {
      username: data.username,
      email: data.email,
    };
  },
});
```

## Nested Objects

Handle nested object structures:

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
      <input {...register('username')} />
      <input {...register('email')} />
      <input {...register('social.twitter')} />
      <input {...register('social.facebook')} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Array Fields

Support array fields within forms:

```tsx
import { useForm } from 'react-hook-form';

type FormValues = {
  username: string;
  phoneNumbers: string[];
};

export const ArrayFieldsForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label>Username</label>
        <input {...register('username', { required: 'Username is required' })} />
        {errors.username && <span>{errors.username.message}</span>}
      </div>

      <div>
        <label>Phone Number 1</label>
        <input {...register('phoneNumbers.0', { required: 'Phone number 1 is required' })} />
        {errors.phoneNumbers?.[0] && <span>{errors.phoneNumbers[0]?.message}</span>}
      </div>

      <div>
        <label>Phone Number 2</label>
        <input {...register('phoneNumbers.1', { required: 'Phone number 2 is required' })} />
        {errors.phoneNumbers?.[1] && <span>{errors.phoneNumbers[1]?.message}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Dynamic Array Fields

Use `useFieldArray` to handle dynamic array fields:

```tsx
import { useForm, useFieldArray } from 'react-hook-form';

type FormValues = {
  tags: { name: string; value: number }[];
};

export const DynamicArrayForm: React.FC = () => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      tags: [{ name: '', value: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'tags',
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {fields.map((field, index) => (
        <div key={field.id}>
          <div>
            <label>Tag Name</label>
            <input
              {...register(`tags.${index}.name`, { required: 'Tag name is required' })}
            />
            {errors.tags?.[index]?.name && <span>{errors.tags[index]?.name?.message}</span>}
          </div>

          <div>
            <label>Tag Value</label>
            <input
              type="number"
              {...register(`tags.${index}.value`, {
                required: 'Tag value is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Minimum value is 1' },
              })}
            />
            {errors.tags?.[index]?.value && <span>{errors.tags[index]?.value?.message}</span>}
          </div>

          {fields.length > 1 && (
            <button type="button" onClick={() => remove(index)}>Remove</button>
          )}
        </div>
      ))}

      <button type="button" onClick={() => append({ name: '', value: 0 })}>Add Tag</button>
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Date and Number Inputs

Handle date and number inputs, with default date values:

```tsx
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

type FormValues = {
  dateOfBirth: string;
  age: number;
};

export const DateNumberForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      dateOfBirth: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label>Age</label>
        <input
          type="number"
          {...register('age', { valueAsNumber: true, required: 'Age is required' })}
        />
        {errors.age && <span>{errors.age.message}</span>}
      </div>

      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          {...register('dateOfBirth', { required: 'Date of birth is required' })}
        />
        {errors.dateOfBirth && <span>{errors.dateOfBirth.message}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Watch Functionality

Use `watch` to observe changes in form fields:

```tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  username: string;
  address: string;
};

export const WatchForm: React.FC = () => {
  const { watch, register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  const watchAllFields = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      console.log('Form values changed:', value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label>Username</label>
        <input {...register('username', { required: 'Username is required' })} />
      </div>
      <div>
        <label>Address</label>
        <input {...register('address', { required: 'Address is required' })} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Programmatic Field Manipulation

Use `getValues` and `setValue` to programmatically access and modify form fields. Disable fields based on conditions.

```tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  username: string;
  address: string;
};

export const AdvancedForm: React.FC = () => {
  const [shouldDisable, setShouldDisable] = useState(false);
  const { getValues, setValue, watch, register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  const handleGetValues = () => {
    const allValues = getValues();
    console.log('Current values:', allValues);
  };

  const handleSetValues = () => {
    setValue('username', getValues('username') + '_UPDATED', {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label>Username</label>
        <input
          {...register('username', {
            disabled: shouldDisable,
            required: 'Username is required',
          })}
        />
      </div>
      <div>
        <label>Address</label>
        <input
          {...register('address', {
            disabled: watch('username') !== 'admin',
            required: 'Address is required',
          })}
        />
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={handleGetValues}>Get Values</button>
      <button type="button" onClick={handleSetValues}>Set Values</button>
      <button type="button" onClick={() => setShouldDisable(!shouldDisable)}>
        Toggle Disable
      </button>
    </form>
  );
};
```

## Form Reset and Form States

Manage form states and reset functionality:

```tsx
import { useForm } from 'react-hook-form';

type FormValues = {
  username: string;
  address: string;
};

export const FormWithStates: React.FC = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    mode: 'onChange',
  });

  const { errors, isDirty, isValid, isSubmitting } = formState;

  const onSubmit = async (data: FormValues) => {
    console.log('Submitted:', data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert('Form submitted successfully!');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label>Username</label>
        <input {...register('username', { required: 'Username is required' })} />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <div>
        <label>Address</label>
        <input {...register('address', { required: 'Address is required' })} />
        {errors.address && <span>{errors.address.message}</span>}
      </div>
      <button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      <button type="button" onClick={() => reset()} disabled={isSubmitting}>
        Reset
      </button>
    </form>
  );
};
```

### Important Form States

- **isDirty**: Indicates if any field has been modified.
- **isValid**: Indicates if there are no validation errors.
- **isSubmitting**: Indicates if the form is currently submitting.
- **isSubmitted**: Indicates if the form has been submitted.
- **isSubmitSuccessful**: Indicates if the form submission was successful.

### Form Reset Functionality

Use `reset` to clear form values and states:

```tsx
reset(); // Resets all fields to default values

reset({ username: 'newUser' }, { keepErrors: true }); // Resets with new values and options
```

### Form Mode Options

Set validation modes when initializing `useForm`:

```tsx
useForm({
  mode: 'onChange', // Validate on change
  // Other modes: 'onBlur', 'onSubmit', 'onTouched', 'all'
});
```

### Error Handling

Handle submission errors:

```tsx
const onError = (errors: FieldErrors<FormValues>) => {
  console.log('Validation errors:', errors);
};

<form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
  {/* Form fields */}
</form>
```

## Async Validation and Manual Trigger

Implement asynchronous validation and manual triggering:

```tsx
import { useForm } from 'react-hook-form';

type FormValues = {
  username: string;
};

const validateUsername = async (username: string) => {
  const isValid = await fetch(`/api/validate-username?username=${username}`);
  return isValid ? true : 'Username is not available';
};

export const AsyncValidationForm: React.FC = () => {
  const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormValues>({
    mode: 'onBlur',
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  const handleManualValidation = () => {
    trigger(); // Validate all fields
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input
        {...register('username', {
          required: 'Username is required',
          validate: validateUsername,
        })}
      />
      {errors.username && <span>{errors.username.message}</span>}

      <button type="button" onClick={handleManualValidation}>
        Validate Manually
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Best Practices

- Return `true` for successful validation; return error message string for failures.
- Consider debouncing async validations to improve performance.
- Use `trigger('fieldName')` to validate specific fields manually.

## Schema Validation with Zod

Integrate React Hook Form with Zod for schema validation.

### Setup

Install Zod and the resolver:

```bash
pnpm install zod @hookform/resolvers
```

### Basic Implementation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required').min(15, 'Must be at least 15 characters'),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ZodForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label>Username</label>
        <input {...register('username')} />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <div>
        <label>Address</label>
        <input {...register('address')} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Advanced Zod Validation Schemas

```tsx
const advancedFormSchema = z.object({
  username: z.string()
    .min(3, 'Must be at least 3 characters')
    .max(20, 'Must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  age: z.number().min(18, 'Must be at least 18').max(100, 'Cannot exceed 100'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter')
    .regex(/[a-z]/, 'One lowercase letter')
    .regex(/[0-9]/, 'One number'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().regex(/^\d{5}$/, 'Invalid zip code'),
  }),
  phoneNumbers: z.array(z.string().regex(/^\d{10}$/, 'Invalid phone number'))
    .min(1, 'At least one phone number is required'),
});
```

### Custom Validation Methods

```tsx
const formSchema = z.object({
  username: z.string().min(1, 'Username is required').refine(async (value) => {
    const isAvailable = await checkUsernameAvailability(value);
    return isAvailable;
  }, 'Username is already taken'),
});
```

## Advanced Topics

### Using DevTools

For debugging, use the React Hook Form DevTools:

```tsx
import { DevTool } from '@hookform/devtools';

export const FormWithDevTools: React.FC = () => {
  const { control } = useForm();
  
  return (
    <>
      <form>{/* Form fields */}</form>
      <DevTool control={control} />
    </>
  );
};
```

### Custom Validation

Create custom validation rules:

```tsx
const { register } = useForm<FormValues>();

<input
  {...register('username', {
    validate: (value) => value !== 'admin' || "Username cannot be 'admin'",
  })}
/>
```

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form Resolvers](https://react-hook-form.com/get-started#SchemaValidation)