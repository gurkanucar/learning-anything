import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../../index.css";

let renderCount = 0;

// Zod validation schema
const formSchema = z.object({
  username: z
    .string()
    .min(15, "Username must be at least 15 characters long") // Validate minimum length
    .min(1, "Username is required"), // Ensure the string is not empty
  address: z.string().optional(), // Make address field optional
});

type FormValues = z.infer<typeof formSchema>;

export const MyForm = () => {
  const form = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema), // Connect Zod schema to the form
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
      <DevTool control={control} />
    </div>
  );
};
