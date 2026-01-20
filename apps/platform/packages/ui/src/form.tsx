import { cn } from "@leadswap/utils";
import { InputHTMLAttributes, ReactNode, useMemo, useState } from "react";
import { Button } from "./button";

export function Form({
  title,
  description,
  inputAttrs,
  helpText,
  buttonText = "Save Changes",
  disabledTooltip,
  handleSubmit,
}: {
  title: string;
  description: string;
  inputAttrs: InputHTMLAttributes<HTMLInputElement>;
  helpText?: string | ReactNode;
  buttonText?: string;
  disabledTooltip?: string | ReactNode;
  handleSubmit: (data: any) => Promise<any>;
}) {
  const [value, setValue] = useState(inputAttrs.defaultValue);
  const [saving, setSaving] = useState(false);
  const saveDisabled = useMemo(() => {
    return saving || !value || value === inputAttrs.defaultValue;
  }, [saving, value, inputAttrs.defaultValue]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await handleSubmit({
          [inputAttrs.name as string]: value,
        });
        setSaving(false);
      }}
      className="rounded-lg border border-border-default bg-bg-default"
    >
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium text-content-emphasis">{title}</h2>
          <p className="text-sm text-content-subtle">{description}</p>
        </div>
        {typeof inputAttrs.defaultValue === "string" ? (
          <input
            {...inputAttrs}
            type={inputAttrs.type || "text"}
            required
            disabled={disabledTooltip ? true : false}
            onChange={(e) => setValue(e.target.value)}
            className={cn(
              "w-full max-w-md rounded-md border border-border-default bg-bg-default text-content-emphasis placeholder-content-muted focus:border-border-emphasis focus:outline-none focus:ring-border-emphasis sm:text-sm",
              {
                "cursor-not-allowed bg-bg-subtle text-content-muted":
                  disabledTooltip,
              },
            )}
          />
        ) : (
          <div className="h-[2.35rem] w-full max-w-md animate-pulse rounded-md bg-bg-subtle" />
        )}
      </div>

      <div className="flex items-center justify-between space-x-4 rounded-b-lg border-t border-border-default bg-bg-muted p-3 sm:px-10">
        {typeof helpText === "string" ? (
          <p
            className="prose-sm prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-content-default text-content-subtle transition-colors"
            dangerouslySetInnerHTML={{ __html: helpText || "" }}
          />
        ) : (
          helpText
        )}
        <div className="shrink-0">
          <Button
            text={buttonText}
            loading={saving}
            disabled={saveDisabled}
            disabledTooltip={disabledTooltip}
          />
        </div>
      </div>
    </form>
  );
}
