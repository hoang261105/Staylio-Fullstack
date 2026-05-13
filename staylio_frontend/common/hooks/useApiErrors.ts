import { useState } from "react";
import toast from "react-hot-toast";

type ApiError = {
  field?: string;
  message: string;
};

export const useApiErrors = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>("");

  const handleApiErrors = (errors: ApiError[]) => {
    const fieldMap: Record<string, string> = {};
    let globalMessage = "";

    errors?.forEach((err) => {
      if (err.field) {
        fieldMap[err.field] = err.message;
      } else {
        globalMessage = err.message;
      }
    });

    setFieldErrors(fieldMap);
    setFormError(globalMessage);

    if (globalMessage) {
      toast.error(globalMessage);
    }
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const clearAllErrors = () => {
    setFieldErrors({});
    setFormError("");
  };

  return {
    fieldErrors,
    formError,
    handleApiErrors,
    clearFieldError,
    clearAllErrors,
  };
};