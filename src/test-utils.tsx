import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { WishlistProvider } from "./context/wishlist-context";

const Providers = ({ children }: PropsWithChildren<{}>) => {
  return <WishlistProvider>{children}</WishlistProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";

export { customRender as render };
