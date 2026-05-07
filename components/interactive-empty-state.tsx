import React, {
  memo,
  useId,
  forwardRef,
  type ReactNode,
  type MouseEventHandler,
} from "react";
import { motion, LazyMotion, domAnimation, type Variants } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface EmptyStateProps extends HTMLMotionProps<"section"> {
  title: string;
  description?: string;
  icons?: ReactNode[];
  action?: EmptyStateAction;
  variant?: Variant;
  size?: Size;
  theme?: Theme;
  isIconAnimated?: boolean;
  className?: string;
}


/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Theme = "light" | "dark" | "neutral";
type Size = "sm" | "default" | "lg";
type Variant = "default" | "subtle" | "error";
type IconVariant = "left" | "center" | "right";

/* -------------------------------------------------------------------------- */
/*                                  UTILS                                     */
/* -------------------------------------------------------------------------- */

export const cn = (
  ...classes: Array<string | false | null | undefined>
): string => classes.filter(Boolean).join(" ");

/* -------------------------------------------------------------------------- */
/*                               ANIMATIONS                                   */
/* -------------------------------------------------------------------------- */

const ICON_VARIANTS: Record<IconVariant, Variants> = {
  left: {
    initial: { scale: 0.8, opacity: 0, rotate: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: -6,
      transition: { duration: 0.4, delay: 0.1 },
    },
    hover: {
      x: -22,
      y: -5,
      rotate: -15,
      scale: 1.1,
      transition: { duration: 0.2 },
    },
  },
  center: {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, delay: 0.2 },
    },
    hover: {
      y: -10,
      scale: 1.15,
      transition: { duration: 0.2 },
    },
  },
  right: {
    initial: { scale: 0.8, opacity: 0, rotate: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 6,
      transition: { duration: 0.4, delay: 0.3 },
    },
    hover: {
      x: 22,
      y: -5,
      rotate: 15,
      scale: 1.1,
      transition: { duration: 0.2 },
    },
  },
};

const CONTENT_VARIANTS: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.2 } },
};

const BUTTON_VARIANTS: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.3 } },
};

/* -------------------------------------------------------------------------- */
/*                              SUB COMPONENTS                                */
/* -------------------------------------------------------------------------- */

interface IconContainerProps {
  children: ReactNode;
  variant: IconVariant;
  className?: string;
  theme?: Theme;
}

const IconContainer = memo<IconContainerProps>(
  ({ children, variant, className, theme = "light" }) => (
    <motion.div
      variants={ICON_VARIANTS[variant]}
      className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center relative shadow-lg transition-all duration-300",
        theme === "dark" &&
          "bg-neutral-800 border border-neutral-700 group-hover:shadow-xl",
        theme === "neutral" &&
          "bg-stone-100 border border-stone-200 group-hover:shadow-xl",
        theme === "light" &&
          "bg-white border border-gray-200 group-hover:shadow-xl",
        className
      )}
    >
      <div
        className={cn(
          "text-sm transition-colors",
          theme === "dark" && "text-neutral-400 group-hover:text-neutral-200",
          theme === "neutral" && "text-stone-500 group-hover:text-stone-700",
          theme === "light" && "text-gray-500 group-hover:text-gray-700"
        )}
      >
        {children}
      </div>
    </motion.div>
  )
);
IconContainer.displayName = "IconContainer";

/* -------------------------------------------------------------------------- */

interface MultiIconDisplayProps {
  icons: ReactNode[];
  theme?: Theme;
}

const MultiIconDisplay = memo<MultiIconDisplayProps>(
  ({ icons, theme = "light" }) => {
    if (icons.length < 3) return null;

    return (
      <div className="flex justify-center isolate relative">
        <IconContainer variant="left" theme={theme}>
          {icons[0]}
        </IconContainer>
        <IconContainer variant="center" theme={theme}>
          {icons[1]}
        </IconContainer>
        <IconContainer variant="right" theme={theme}>
          {icons[2]}
        </IconContainer>
      </div>
    );
  }
);
MultiIconDisplay.displayName = "MultiIconDisplay";

/* -------------------------------------------------------------------------- */

interface BackgroundProps {
  theme?: Theme;
}

const Background = ({ theme }: BackgroundProps) => (
  <div
    aria-hidden="true"
    className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500"
    style={{
      backgroundImage:
        theme === "dark"
          ? "radial-gradient(circle at 2px 2px, #fff 1px, transparent 1px)"
          : "radial-gradient(circle at 2px 2px, #000 1px, transparent 1px)",
      backgroundSize: "24px 24px",
    }}
  />
);

/* -------------------------------------------------------------------------- */
/*                                EMPTY STATE                                 */
/* -------------------------------------------------------------------------- */

interface EmptyStateAction {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
  disabled?: boolean;
}

export const EmptyState = forwardRef<HTMLElement, EmptyStateProps>(
  (
    {
      title,
      description,
      icons,
      action,
      variant = "default",
      size = "default",
      theme = "light",
      isIconAnimated = true,
      className,
      ...props
    },
    ref
  ) => {
    const titleId = useId();
    const descriptionId = useId();

    const sizeClasses: Record<Size, string> = {
      sm: "p-6",
      default: "p-8",
      lg: "p-12",
    };

    const variantClasses: Record<Variant, Record<Theme, string>> = {
      default: {
        light:
          "bg-white border-dashed border-2 border-gray-300 hover:border-gray-400",
        dark:
          "bg-neutral-900 border-dashed border-2 border-neutral-700 hover:border-neutral-600",
        neutral:
          "bg-stone-50 border-dashed border-2 border-stone-300 hover:border-stone-400",
      },
      subtle: {
        light: "bg-white",
        dark: "bg-neutral-900",
        neutral: "bg-stone-50",
      },
      error: {
        light: "bg-red-50 border border-red-200",
        dark: "bg-red-950 border border-red-800",
        neutral: "bg-red-50 border border-red-300",
      },
    };

    return (
      <LazyMotion features={domAnimation}>
        <motion.section
          ref={ref}
          role="region"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "group relative rounded-xl text-center flex flex-col items-center justify-center transition-all",
            sizeClasses[size],
            variantClasses[variant][theme],
            className
          )}
          initial="initial"
          animate="animate"
          whileHover={isIconAnimated ? "hover" : "animate"}
          {...props}
        >
          <Background theme={theme} />

          {icons && (
            <div className="mb-6">
              <MultiIconDisplay icons={icons} theme={theme} />
            </div>
          )}

          <motion.div variants={CONTENT_VARIANTS} className="space-y-2 mb-6">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-gray-500">
                {description}
              </p>
            )}
          </motion.div>

          {action && (
            <motion.div variants={BUTTON_VARIANTS}>
              <button
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                className="relative z-20 cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md shadow-sm"
              >
                {action.icon}
                {action.label}
              </button>
            </motion.div>
          )}
        </motion.section>
      </LazyMotion>
    );
  }
);

EmptyState.displayName = "EmptyState";
