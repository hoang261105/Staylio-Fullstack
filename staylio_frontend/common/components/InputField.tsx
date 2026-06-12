import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
  error?: string;
  required?: boolean;
}

export const InputField = ({
  label,
  icon: Icon,
  error,
  required,
  type = "text",
  ...props
}: InputFieldProps) => {
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className="mb-4">
      <label className="block text-sm mb-2 text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      <div className="relative w-full">
        <input
          {...props}
          type={inputType}
          className={`w-full box-border px-4 py-3 ${
            isPassword ? "pr-12" : ""
          } ${
            Icon ? "pl-11" : ""
          } border ${
            error ? "border-destructive" : "border-input"
          } bg-background text-foreground rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors`}
        />

        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
