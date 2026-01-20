import { cn } from "@leadswap/utils";

export function CompositeLogo({ className }: { className?: string }) {
  const maskImage = "url('/assets/logo.png')";
  return (
    <span
      aria-hidden="true"
      style={{
        maskImage,
        WebkitMaskImage: maskImage,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
      className={cn(
        "inline-block aspect-square h-6 w-auto bg-current text-black dark:text-white",
        className,
      )}
    />
  );
}
