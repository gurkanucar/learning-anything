import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

let renderCount = 0;

type FormValues = {
  username: string;
  socialMedia: {
    twitter: string;
  };
  tags: { name: string; value: number }[];
};

export const MyForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
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
