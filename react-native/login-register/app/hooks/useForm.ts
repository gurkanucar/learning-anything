import { useState } from 'react';

interface FormErrors {
  [key: string]: string | undefined;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  pattern?: RegExp;
  matches?: (value: string, formData: any) => boolean;
  customValidate?: (value: string, formData: any) => string | undefined;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface UseFormProps<T> {
  initialValues: T;
  validationRules?: ValidationRules;
}

export function useForm<T extends { [key: string]: any }>({ 
  initialValues, 
  validationRules = {} 
}: UseFormProps<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (name: keyof T) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateField = (name: keyof T, value: string): string | undefined => {
    const rules = validationRules[name as string];
    if (!rules) return undefined;

    if (rules.required && !value) {
      return `${String(name)} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${String(name)} must be at least ${rules.minLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `Please enter a valid ${String(name)}`;
    }

    if (rules.matches && !rules.matches(value, formData)) {
      return `${String(name)} does not match`;
    }

    if (rules.customValidate) {
      return rules.customValidate(value, formData);
    }

    return undefined;
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key as keyof T, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    formData,
    errors,
    handleChange,
    validate,
    setFormData,
    setErrors,
  };
}

export default useForm; 