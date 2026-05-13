interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
  onClick?: () => void;
}

export default function Logo({ size = "md", variant = "full", className = "", onClick }: LogoProps) {
  const logoSrc = "/src/imports/e2221885-1f90-4880-af87-e5ac348b819d.jpg";

  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  if (variant === "icon") {
    return (
      <div
        onClick={onClick}
        className={`${sizeClasses[size]} aspect-square bg-gradient-to-br from-[#C9A961] to-[#1B2B4D] rounded-lg flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <span className="text-white" style={{ fontSize: size === 'lg' ? '1.5rem' : size === 'md' ? '1.25rem' : '1rem' }}>🏨</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <img
        src={logoSrc}
        alt="STAYLIO"
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
}
