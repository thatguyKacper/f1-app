import * as React from "react";
import { cn } from "@/lib/utils";

function Header({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="header"
      className={cn(
        "border-b border-border pb-4 flex flex-col md:flex-row md:justify-between md:items-end flex-wrap gap-4",
        className,
      )}
      {...props}
    />
  );
}

function HeaderContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="header-content"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function HeaderTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="header-title"
      className={cn(
        "text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function HeaderDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="header-description"
      className={cn("text-muted-foreground font-medium mt-1", className)}
      {...props}
    />
  );
}

function HeaderActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="header-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

export { Header, HeaderContent, HeaderTitle, HeaderDescription, HeaderActions };
