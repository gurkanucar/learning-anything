import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm password is required"),
    fullName: z.string().min(1, "Full name is required"),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender",
    }),
    address: z.string().min(10, "Address must be at least 10 characters"),
    bio: z.string().max(200, "Bio must not exceed 200 characters").optional(),
    interests: z.array(z.string()).min(1, "Select at least one interest"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms"
    }),
    notifications: z.boolean().optional(),
    userType: z.enum(["personal", "business"], {
      required_error: "Please select account type",
    }),
    birthDate: z.date({
      required_error: "Birth date is required",
    }),
    availableDates: z.object({
      from: z.date({
        required_error: "Start date is required",
      }),
      to: z.date({
        required_error: "End date is required",
      }),
    }),
    time: z.string().min(1, "Time is required"),
    experience: z.number().min(0, "Experience level is required"),
    seniority: z.enum(["junior", "mid", "senior"], {
      required_error: "Please select seniority level",
    }),
    skills: z.array(z.string()).min(1, "Select at least one skill"),
    age: z.number().nullable()
      .refine((val) => val === null || val >= 18, {
        message: "Must be at least 18 years old",
      })
      .refine((val) => val === null || val <= 100, {
        message: "Must be under 100 years old",
      })
      .refine((val) => val !== null, {
        message: "Age is required",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
