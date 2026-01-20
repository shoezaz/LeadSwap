import { cn } from "@leadswap/utils";

export function Logo({ className }: { className?: string }) {
  const maskImage = "url('/logo.svg')";
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
        "inline-block aspect-square h-10 w-auto bg-current text-black dark:text-white",
        className,
      )}
    />
  );
}
