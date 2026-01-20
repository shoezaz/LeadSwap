import { Button, Modal, useMediaQuery } from "@leadswap/ui";
import { cn } from "@leadswap/utils";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type AICopyMode = "generate" | "improve";

export type AICopyField = {
  key: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
};

export function AICopyFieldsModal({
  showModal,
  setShowModal,
  title,
  description,
  instructionLabel = "Brief / instructions (optional)",
  instructionPlaceholder = "What should the AI write? Add key points, tone, CTA, etc.",
  defaultInstructions = "",
  fields,
  currentValues,
  defaultMode = "generate",
  onRequest,
  onApply,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: string;
  instructionLabel?: string;
  instructionPlaceholder?: string;
  defaultInstructions?: string;
  fields: AICopyField[];
  currentValues: Record<string, string>;
  defaultMode?: AICopyMode;
  onRequest: (params: {
    mode: AICopyMode;
    instructions: string;
    currentValues: Record<string, string>;
  }) => Promise<Record<string, string>>;
  onApply: (values: Record<string, string>) => void;
}) {
  const { isMobile } = useMediaQuery();

  const [instructions, setInstructions] = useState(defaultInstructions);
  const [resultValues, setResultValues] = useState<Record<string, string>>({});
  const [hasResult, setHasResult] = useState(false);
  const [isLoadingMode, setIsLoadingMode] = useState<AICopyMode | null>(null);
  const [lastMode, setLastMode] = useState<AICopyMode>(defaultMode);

  useEffect(() => {
    if (!showModal) return;
    setInstructions(defaultInstructions);
    setHasResult(false);
    setResultValues({});
    setIsLoadingMode(null);
    setLastMode(defaultMode);
  }, [showModal, defaultInstructions, defaultMode]);

  const canImprove = useMemo(
    () => Object.values(currentValues).some((v) => v.trim().length > 0),
    [currentValues],
  );

  const run = async (mode: AICopyMode) => {
    setIsLoadingMode(mode);
    setLastMode(mode);
    try {
      const values = await onRequest({
        mode,
        instructions,
        currentValues,
      });
      setResultValues(values);
      setHasResult(true);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to generate AI suggestion.",
      );
    } finally {
      setIsLoadingMode(null);
    }
  };

  const applyDisabled = !hasResult;

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="border-b border-neutral-200 px-4 py-4 sm:px-6">
        <h3 className="truncate text-lg font-medium">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>

      <div className="bg-neutral-50">
        <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
          <div>
            <label className="text-content-emphasis text-sm font-medium">
              {instructionLabel}
            </label>
            <div className="mt-2">
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={instructionPlaceholder}
                rows={3}
                autoFocus={!isMobile}
                className="block w-full rounded-md border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-neutral-500 sm:text-sm"
              />
            </div>
          </div>

          {hasResult && (
            <div className="space-y-5">
              {fields.map((field) => {
                const value = resultValues[field.key] ?? "";
                const maxLength = field.maxLength;

                return (
                  <div key={field.key}>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`ai-field-${field.key}`}
                        className="text-content-emphasis text-sm font-medium"
                      >
                        {field.label}
                      </label>
                      {maxLength != null && (
                        <span className="text-xs text-neutral-400">
                          {value.length}/{maxLength}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      {field.multiline ? (
                        <textarea
                          id={`ai-field-${field.key}`}
                          value={value}
                          onChange={(e) =>
                            setResultValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                          rows={field.rows ?? 6}
                          maxLength={maxLength}
                          className={cn(
                            "block w-full rounded-md border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-neutral-500 sm:text-sm",
                            maxLength != null &&
                              value.length > maxLength &&
                              "border-red-600 focus:border-red-500 focus:ring-red-600",
                          )}
                        />
                      ) : (
                        <input
                          id={`ai-field-${field.key}`}
                          type="text"
                          value={value}
                          onChange={(e) =>
                            setResultValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                          maxLength={maxLength}
                          className={cn(
                            "block w-full rounded-md border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-neutral-500 sm:text-sm",
                            maxLength != null &&
                              value.length > maxLength &&
                              "border-red-600 focus:border-red-500 focus:ring-red-600",
                          )}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-neutral-200 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              text="Generate"
              className="h-9 w-fit"
              loading={isLoadingMode === "generate"}
              onClick={() => run("generate")}
            />
            <Button
              type="button"
              variant="secondary"
              text="Improve"
              className="h-9 w-fit"
              disabled={!canImprove}
              loading={isLoadingMode === "improve"}
              onClick={() => run("improve")}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              text="Cancel"
              className="h-9 w-fit"
              onClick={() => setShowModal(false)}
              disabled={isLoadingMode !== null}
            />
            <Button
              type="button"
              variant="primary"
              text={lastMode === "improve" ? "Apply improvements" : "Apply"}
              className="h-9 w-fit"
              disabled={applyDisabled}
              onClick={() => {
                onApply(resultValues);
                setShowModal(false);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

