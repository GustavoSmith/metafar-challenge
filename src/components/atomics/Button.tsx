import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@/lib/utils";
import { IButtonProps } from "../../types";

const variantClasses: Record<IButtonProps["variant"], string> = {
  contained: "bg-blue-600 text-white hover:bg-blue-700",
  outlined: "border border-gray-300 bg-transparent hover:bg-gray-50",
  text: "bg-transparent hover:bg-gray-100",
};

const CustomButton: React.FC<IButtonProps> = ({
  type,
  variant,
  children,
  className,
}) => (
  <BaseButton
    type={type}
    className={cn(
      "inline-flex cursor-pointer items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </BaseButton>
);

export default CustomButton;
