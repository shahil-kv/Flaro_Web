"use client";

import React, { useState } from "react";
import * as yup from "yup";
import { Eye, EyeOff, Globe } from "lucide-react";
import { motion } from "framer-motion";

// Define interface for form fields
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "phone";
  placeholder: string;
  defaultCode?: string; // Optional country code for phone fields
  maxLength?: number;
}

// Define interface for country codes
interface Country {
  name: string;
  code: string;
}

// Define props for the DynamicForm component
interface DynamicFormProps<T extends yup.AnyObjectSchema> {
  fields: FormField[];
  onSubmit: (data: yup.InferType<T>) => Promise<void>;
  validationSchema: T;
  renderButton: (handleSubmit: () => void) => React.ReactNode;
}

// Common country codes for the selector
const countries: Country[] = [
  { name: "India", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
  { name: "Canada", code: "+12" },
];

// Animation variants for form fields
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function DynamicForm<T extends yup.AnyObjectSchema>({
  fields,
  onSubmit,
  validationSchema,
  renderButton,
}: DynamicFormProps<T>) {
  // Initialize form data based on fields
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as Record<string, string>);

  // State for form data, errors, password visibility, and country code
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
  const [selectedCountry, setSelectedCountry] = useState<string>(
    fields.find((f) => f.type === "phone")?.defaultCode || "+91"
  );

  // Handle input changes for form fields
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle country code selection
  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
  };

  // Handle form submission with validation
  const handleSubmit = async () => {
    try {
      // Include country code in phone number for submission
      const submitData = { ...formData };
      if (fields.some((f) => f.type === "phone")) {
        submitData.phoneNumber = `${selectedCountry}${
          formData.phoneNumber || ""
        }`;
      }
      const validatedData = await validationSchema.validate(submitData, {
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
      }}
      className="space-y-4"
    >
      {fields.map((field) => (
        <motion.div
          key={field.name}
          className="relative"
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Render field label */}
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
          </label>
          <div className="relative">
            {/* Render country selector for phone fields */}
            {field.type === "phone" && (
              <div className="absolute left-0 top-0 h-12 w-24 flex items-center border-r border-gray-300">
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="appearance-none bg-transparent w-full pl-3 pr-1 text-gray-700 focus:outline-none"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.name})
                    </option>
                  ))}
                </select>
                <Globe size={16} className="text-gray-500 mr-1" />
              </div>
            )}
            {/* Render input field */}
            <input
              id={field.name}
              type={
                field.type === "phone"
                  ? "tel"
                  : field.type === "password" && showPassword[field.name]
                  ? "text"
                  : field.type
              }
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`w-full p-3 ${
                field.type === "phone" ? "pl-28" : "pr-10"
              } border rounded-xl h-12 text-[#1F2937] placeholder:text-gray-400 focus:border-[#FF6347] focus:outline-none transition-colors ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {/* Render password visibility toggle */}
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
          </div>
          {/* Render error message */}
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
          )}
        </motion.div>
      ))}
      {renderButton(handleSubmit)}
    </form>
  );
}
