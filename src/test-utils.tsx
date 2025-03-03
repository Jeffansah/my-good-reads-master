import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { WishlistProvider } from "./context/wishlist-context";

// Wrapper component that provides necessary context providers
const Providers = ({ children }: PropsWithChildren<{}>) => {
  return <WishlistProvider>{children}</WishlistProvider>;
};

// Custom render function that wraps components with necessary providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Providers, ...options });

// Re-export all testing library utilities
export * from "@testing-library/react";

// Export custom render as default render function
export { customRender as render };
