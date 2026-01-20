/**
 * Cliqo Design System Theme
 * Inspired by instinct.so - Dark mode first, minimal, bold typography
 */

export const cliqoTheme = {
  colors: {
    bg: {
      primary: "bg-neutral-950", // #0a0a0a
      secondary: "bg-neutral-900", // #171717
      elevated: "bg-neutral-800", // #262626
    },
    text: {
      primary: "text-neutral-50", // #fafafa
      secondary: "text-neutral-400", // #a3a3a3
      muted: "text-neutral-400/70",
    },
    border: {
      subtle: "border-neutral-800",
      default: "border-neutral-700",
    },
  },
  typography: {
    // 96px headline - hero titles
    headline: "text-[96px] leading-[100%] tracking-[-0.05em] font-normal",
    headlineMd: "text-[64px] leading-[100%] tracking-[-0.04em] font-normal",
    headlineSm: "text-[48px] leading-[100%] tracking-[-0.03em] font-normal",
    // Section titles
    title: "text-[48px] leading-[110%] tracking-[-0.03em] font-medium",
    titleMd: "text-[36px] leading-[110%] tracking-[-0.02em] font-medium",
    titleSm: "text-[24px] leading-[120%] tracking-[-0.01em] font-medium",
    // Body text
    body: "text-lg leading-relaxed",
    bodyMd: "text-base leading-relaxed",
    bodySm: "text-sm leading-relaxed",
    // Mono for footer/metadata
    mono: "font-mono text-sm",
  },
  radius: {
    pill: "rounded-[2097150rem]", // Full pill shape
    card: "rounded-2xl",
    button: "rounded-xl",
  },
  spacing: {
    section: "py-24 md:py-32",
    sectionSm: "py-16 md:py-24",
  },
} as const;

// CSS class utilities
export const cliqoClasses = {
  // Backgrounds
  bgPrimary: "bg-neutral-950",
  bgSecondary: "bg-neutral-900",
  bgElevated: "bg-neutral-800",

  // Text
  textPrimary: "text-neutral-50",
  textSecondary: "text-neutral-400",
  textMuted: "text-neutral-400/70",

  // Borders
  borderSubtle: "border-neutral-800",
  borderDefault: "border-neutral-700",

  // Common patterns
  card: "bg-neutral-900 border border-neutral-800 rounded-2xl",
  cardHover: "hover:border-neutral-700 transition-colors",
  divider: "h-px bg-neutral-800 w-full",
  dividerVertical: "w-px bg-neutral-800 h-full",

  // Gradient fades (for header/footer)
  gradientTop: "bg-gradient-to-b from-neutral-950 to-transparent",
  gradientBottom: "bg-gradient-to-t from-neutral-950 to-transparent",

  // Focus states
  focusRing: "focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-950",
} as const;

// Button variants
export const cliqoButtonVariants = {
  primary: "bg-neutral-50 text-neutral-950 hover:bg-neutral-200",
  secondary: "bg-transparent border border-neutral-800 text-neutral-50 hover:border-neutral-600 hover:bg-neutral-900",
  ghost: "bg-transparent text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800",
} as const;

// Size variants
export const cliqoSizeVariants = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
} as const;

export type CliqoButtonVariant = keyof typeof cliqoButtonVariants;
export type CliqoSizeVariant = keyof typeof cliqoSizeVariants;
