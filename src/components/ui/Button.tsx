import Link from "next/link";
import React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "contact" | "default";

type ButtonAsLink = {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type ButtonAsButton = {
  href?: undefined;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonProps = ButtonAsLink | ButtonAsButton;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "primary_btn",
  secondary: "secondary_btn",
  contact: "contact-btn",
  default: "",
};

export const Button = ({ className, href, variant = "default", children, ...props }: ButtonProps) => {
  const classes = cn("text-decoration-none d-inline-block transition", variantClasses[variant], className);

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
};

Button.displayName = "Button";
