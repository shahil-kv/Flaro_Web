"use client";
import React, { useState } from "react";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "phone";
  placeholder: string;
  defaultCode?: string;
}

interface DynamicFormProps<T extends yup.AnyObjectSchema> {
  fields: FormField[];
  onSubmit: (data: yup.InferType<T>) => Promise<void>;
  validationSchema: T;
  renderButton: (handleSubmit: () => void) => React.ReactNode;
}

export function DynamicForm<T extends yup.AnyObjectSchema>({
  fields,
  onSubmit,
  validationSchema,
  renderButton,
}: DynamicFormProps<T>) {
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as Record<string, string>);

  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>(
    fields.reduce((acc, field) => {
      if (field.type === "password") {
        acc[field.name] = false;
      }
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    try {
      const validatedData = await validationSchema.validate(formData, {
        abortEarly: false,
      });
      setErrors({});
      await onSubmit(validatedData as yup.InferType<T>);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error("Form submission error:", error);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-4"
    >
      {fields.map((field) => (
        <div key={field.name} className="relative">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
          </label>
          <div className="relative">
            <input
              id={field.name}
              type={
                field.type === "phone"
                  ? "tel"
                  : field.type === "password" && showPassword[field.name]
                  ? "text"
                  : field.type
              }
              placeholder={
                field.type === "phone"
                  ? `${field.defaultCode || ""} ${field.placeholder}`
                  : field.placeholder
              }
              value={formData[field.name]}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`w-full p-3 pr-10 border rounded-xl h-12 text-[#1F2937] placeholder:text-gray-400 focus:border-[#FF6347] focus:outline-none transition-colors ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {field.type === "password" && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field.name)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword[field.name] ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            )}
            {field.type === "phone" && field.defaultCode && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {field.defaultCode}
              </span>
            )}
          </div>
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}
      {renderButton(handleSubmit)}
    </form>
  );
}
