"use client";

import React from "react";
import { useDynamicTheme, ThemeColors } from "./dynamic-theme-provider";
import { cn } from "@workspace/ui/lib/utils";

interface ThemedProps extends React.ComponentPropsWithoutRef<any> {
  as?: React.ElementType;
  colorType?: keyof ThemeColors;
  applyTo?: "color" | "backgroundColor" | "borderColor" | "fill" | "stroke";
  children?: React.ReactNode;
}

export function Themed({
  as: Component = "div",
  colorType,
  applyTo = "color",
  className,
  style,
  children,
  ...props
}: ThemedProps) {
  const { theme } = useDynamicTheme();

  const themedStyle = React.useMemo(() => {
    if (!colorType) return style;

    const kebabColorType = colorType.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    const fallbackValue = theme.colors[colorType as keyof typeof theme.colors];
    const colorValue = `var(--theme-${kebabColorType}${fallbackValue ? `, ${fallbackValue}` : ""})`;
    
    return {
      ...style,
      [applyTo]: colorValue,
    };
  }, [colorType, applyTo, style, theme]);

  const handleClick = (e: React.MouseEvent) => {
    if (window.parent !== window) {
      // if in iframe (preview)
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage({ type: "THEME_ELEMENT_CLICKED", colorType }, "*");
    }
  };

  return (
    <Component
      className={className}
      style={themedStyle}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Component>
  );
}
