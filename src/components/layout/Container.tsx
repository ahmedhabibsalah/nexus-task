import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = "full",
  className = "",
  padding = true,
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = padding ? "px-4 sm:px-6 lg:px-8" : "";

  return (
    <div
      className={`container mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};
