import { Logo } from "@leadswap/ui";
import { cn } from "@leadswap/utils";
import Image from "next/image";

export function ModalHero() {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-white">
      <BackgroundGradient className="opacity-15" />
      <Image
        src="https://assets.dub.co/misc/welcome-modal-background.svg"
        alt="Welcome to Cliqo"
        fill
        className="object-cover object-top"
      />
      <BackgroundGradient className="opacity-100 mix-blend-soft-light" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="aspect-square h-1/2 rounded-full bg-white">
          <Logo className="size-full" />
        </div>
      </div>
    </div>
  );
}

function BackgroundGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 aspect-square w-full overflow-hidden sm:aspect-[2/1]",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(135deg, #e0f2fe 0%, #cffafe 100%)`,
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[50px]" />
    </div>
  );
}
