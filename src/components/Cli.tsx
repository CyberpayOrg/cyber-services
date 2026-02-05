"use client"

import { cva, cx } from "class-variance-authority"
import { type ReactNode, useEffect, useRef, useState } from "react"

export function Window({ children, className }: Window.Props) {
  return (
    <div
      className={cx(
        "bg-gray2 rounded-xl overflow-hidden font-mono text-sm border border-primary",
        className,
      )}
    >
      {children}
    </div>
  )
}

export namespace Window {
  export type Props = {
    children: ReactNode
    className?: string
  }
}

export function TitleBar({ title, children, className }: TitleBar.Props) {
  return (
    <div
      className={cx(
        "flex items-center justify-between px-4 py-2.5 border-b border-primary bg-primary text-gray8",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        {title && <span className="text-xs ml-2">{title}</span>}
      </div>
      {children && (
        <div className="flex items-center gap-3 text-xs">{children}</div>
      )}
    </div>
  )
}

export namespace TitleBar {
  export type Props = {
    title?: string
    children?: ReactNode
    className?: string
  }
}

export function Panel({
  children,
  height,
  autoScroll,
  className,
}: Panel.Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  })

  return (
    <div
      ref={ref}
      className={cx("p-4 overflow-y-auto bg-primary flex flex-col-reverse", className)}
      style={height ? { height } : undefined}
    >
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  )
}

export namespace Panel {
  export type Props = {
    children: ReactNode
    height?: number
    autoScroll?: boolean
    className?: string
  }
}

export function Line({
  variant,
  prefix,
  children,
  className,
}: Line.Props) {
  return (
    <div
      className={cva("leading-normal whitespace-nowrap", {
        variants: {
          variant: {
            default: "text-primary",
            info: "text-gray8",
            success: "text-success",
            error: "text-destructive",
            input: "text-primary",
            warning: "text-warning",
            loading: "text-secondary",
          },
        },
        defaultVariants: {
          variant: "default",
        },
      })({ variant, className })}
    >
      {variant === "loading" && <Spinner />}
      {prefix && (
        <span
          className={cva("", {
            variants: {
              variant: {
                default: "text-primary",
                info: "text-gray8",
                success: "text-success",
                error: "text-destructive",
                input: "text-accent8",
                warning: "text-warning",
                loading: "text-[light-dark(var(--vocs-color-accent),var(--vocs-color-accent8))]",
              },
            },
            defaultVariants: {
              variant: "default",
            },
          })({ variant })}
        >
          {prefix}{" "}
        </span>
      )}
      {children}
    </div>
  )
}

function Spinner() {
  const [frame, setFrame] = useState(0)
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="text-[light-dark(var(--vocs-color-accent),var(--vocs-color-accent8))]">
      {frames[frame]}{" "}
    </span>
  )
}

export namespace Line {
  export type Variant =
    | "default"
    | "info"
    | "success"
    | "error"
    | "input"
    | "warning"
    | "loading"

  export type Props = {
    variant?: Variant
    prefix?: "❯" | "✓" | "✗" | "→"
    children: ReactNode
    className?: string
  }
}

export function Block({ children, className }: Block.Props) {
  return <div className={cx("flex flex-col gap-1", className)}>{children}</div>
}

export namespace Block {
  export type Props = {
    children: ReactNode
    className?: string
  }
}

export function Link({ href, children, className }: Link.Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "text-[light-dark(var(--vocs-color-accent),var(--vocs-color-accent8))] underline block leading-relaxed",
        className,
      )}
    >
      {children}
    </a>
  )
}

export namespace Link {
  export type Props = {
    href: string
    children: ReactNode
    className?: string
  }
}

export function Blank({ className }: Blank.Props) {
  return <div className={cx("h-4", className)} />
}

export namespace Blank {
  export type Props = {
    className?: string
  }
}

export function CtaBar({ children, className }: CtaBar.Props) {
  return (
    <div
      className={cx(
        "flex items-center justify-between px-4 py-2.5 border-t border-primary bg-primary",
        className,
      )}
    >
      {children}
    </div>
  )
}

export namespace CtaBar {
  export type Props = {
    children: ReactNode
    className?: string
  }
}

