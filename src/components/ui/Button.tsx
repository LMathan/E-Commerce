import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-neutral-900 text-white border border-neutral-900 hover:bg-neutral-700 hover:border-neutral-700 focus-visible:ring-neutral-900 active:scale-[0.98]",
        secondary:
          "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 focus-visible:ring-neutral-500 active:scale-[0.98]",
        ghost:
          "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-500",
        destructive:
          "bg-red-600 text-white border border-red-600 hover:bg-red-700 focus-visible:ring-red-600 active:scale-[0.98]",
        outline:
          "border border-neutral-300 bg-transparent hover:bg-neutral-50 text-neutral-900",
        link:
          "text-neutral-900 underline-offset-4 hover:underline focus-visible:ring-neutral-500",
        brand:
          "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600 active:scale-[0.98]",
      },
      size: {
        xs: "h-7 px-3 text-xs rounded-md gap-1.5",
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              leftIcon
            )}
            {children}
            {!isLoading && rightIcon}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
