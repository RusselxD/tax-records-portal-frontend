import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "bg-white text-primary border border-gray-300 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
};

const Spinner = () => (
  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Spinner />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
