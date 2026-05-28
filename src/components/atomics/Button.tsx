import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@/lib/utils";
import { IButtonProps } from "../../types";

const variantClasses: Record<IButtonProps["variant"], string> = {
  contained: "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90",
  outlined:
    "border border-border bg-surface text-foreground hover:bg-surface-muted",
  text: "bg-transparent text-accent hover:bg-accent-muted",
};

const CustomButton: React.FC<IButtonProps> = ({
  type = "button",
  variant,
  children,
  className,
  ...props
}) => (
  <BaseButton
    type={type}
    className={cn(
      "focus-visible:outline-accent inline-flex h-10 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      variantClasses[variant],
      className,
    )}
    {...props}
  >
    {children}
  </BaseButton>
);

export default CustomButton;
