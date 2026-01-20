import { cn } from "@leadswap/utils";
import { AlertCircle } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Eye, EyeSlash } from "./icons";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const toggleIsPasswordVisible = useCallback(
      () => setIsPasswordVisible(!isPasswordVisible),
      [isPasswordVisible, setIsPasswordVisible],
    );

    return (
      <div>
        <div className="relative flex">
          <input
            type={isPasswordVisible ? "text" : type}
            className={cn(
              "w-full max-w-md rounded-md border border-border-default bg-bg-default text-content-emphasis placeholder-content-muted read-only:bg-bg-subtle read-only:text-content-subtle focus:border-border-emphasis focus:outline-none focus:ring-border-emphasis sm:text-sm",
              props.error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500",
              className,
            )}
            ref={ref}
            {...props}
          />

          <div className="group">
            {props.error && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-none items-center px-2.5">
                <AlertCircle
                  className={cn(
                    "size-5 text-white",
                    type === "password" &&
                    "transition-opacity group-hover:opacity-0",
                  )}
                  fill="#ef4444"
                />
              </div>
            )}
            {type === "password" && (
              <button
                className={cn(
                  "absolute inset-y-0 right-0 flex items-center px-3",
                  props.error &&
                  "opacity-0 transition-opacity group-hover:opacity-100",
                )}
                type="button"
                onClick={() => toggleIsPasswordVisible()}
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show Password"
                }
              >
                {isPasswordVisible ? (
                  <Eye
                    className="size-4 flex-none text-content-subtle transition hover:text-content-default"
                    aria-hidden
                  />
                ) : (
                  <EyeSlash
                    className="size-4 flex-none text-content-subtle transition hover:text-content-default"
                    aria-hidden
                  />
                )}
              </button>
            )}
          </div>
        </div>

        {props.error && (
          <span
            className="mt-2 block text-sm text-red-500"
            role="alert"
            aria-live="assertive"
          >
            {props.error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
