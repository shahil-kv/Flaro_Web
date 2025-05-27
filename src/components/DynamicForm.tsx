"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

// Define types for the form fields
type FieldType = "text" | "email" | "password" | "phone" | "number";

interface DynamicField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  maxLength?: number;
  defaultCode?: string; // For phone type
}

interface FormFieldsProps {
  control: any;
  fields: DynamicField[];
  errors: any;
}

// Password Input Component
const PasswordInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}> = ({ value, onChange, placeholder, maxLength }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full p-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

// Phone Input Component
const PhoneInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  defaultCode?: string;
}> = ({ value, onChange, placeholder, maxLength, defaultCode = "+91" }) => {
  const [countryCode, setCountryCode] = useState(defaultCode);

  const commonCountryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+86", country: "China" },
    { code: "+81", country: "Japan" },
  ];

  const handlePhoneChange = (text: string) => {
    const cleanNumber = text.replace(/^\+\d+/, "");
    onChange(cleanNumber);
  };

  // Store the country code for submission
  useEffect(() => {
    (onChange as any).countryCode = countryCode;
  }, [countryCode, onChange]);
  return (
    <div className="flex items-center border border-gray-300 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
      <div className="relative">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="appearance-none h-12 px-3 pr-8 border-r border-gray-300 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none"
        >
          {commonCountryCodes.map((item) => (
            <option key={item.code} value={item.code}>
              {item.code} ({item.country})
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
        />
      </div>
      <input
        type="tel"
        value={value}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="flex-1 p-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

// Form Fields Component
const FormFields: React.FC<FormFieldsProps> = ({ control, fields, errors }) => {
  return (
    <div className="w-full">
      {fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="mb-2 font-medium text-gray-900 dark:text-gray-100 block">
            {field.label}
          </label>
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value } }) => {
              if (field.type === "password") {
                return (
                  <PasswordInput
                    value={value || ""}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                  />
                );
              } else if (field.type === "phone") {
                return (
                  <PhoneInput
                    value={value || ""}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    defaultCode={field.defaultCode}
                  />
                );
              }
              return (
                <input
                  type={field.type}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              );
            }}
          />
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-500">
              {String(errors[field.name]?.message)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// DynamicForm Component
interface DynamicFormProps {
  fields: DynamicField[];
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  validationSchema?: any;
  renderButton?: (handleSubmit: () => void) => React.ReactNode;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  defaultValues = {},
  validationSchema,
  renderButton,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
  });

  const handleFormSubmit = (data: any) => {
    const processedData = { ...data };
    fields.forEach((field) => {
      if (field.type === "phone" && data[field.name]) {
        const countryCode =
          (control as any)._fields[field.name]?.onChange?.countryCode || "+91";
        processedData[field.name] = `${countryCode}${data[field.name]}`;
      }
    });
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
      <FormFields control={control} fields={fields} errors={errors} />
      {renderButton && renderButton(handleSubmit(handleFormSubmit))}
    </form>
  );
};

export default DynamicForm;
