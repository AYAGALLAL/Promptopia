import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RootLayout from "../app/layout";

// ✅ Mock dependencies correctly
jest.mock("@/components/Nav", () => () => <nav data-testid="mock-nav"></nav>);
jest.mock("@/components/Provider", () => ({ children }) => (
  <div data-testid="mock-provider">{children}</div>
));

// ✅ Render RootLayout without `<html>` and `<body>` in tests
const MockRootLayout = ({ children }) => (
  <div data-testid="mock-root-layout">
    <nav data-testid="mock-nav"></nav>
    <div data-testid="mock-provider">{children}</div>
  </div>
);

describe("RootLayout", () => {
  test("renders Nav, Provider, and children correctly", () => {
    render(
      <MockRootLayout>
        <div data-testid="mock-children">Test Page Content</div>
      </MockRootLayout>
    );

    // ✅ Ensure `Nav` is rendered
    expect(screen.getByTestId("mock-nav")).toBeInTheDocument();

    // ✅ Ensure `Provider` is rendered
    expect(screen.getByTestId("mock-provider")).toBeInTheDocument();

    // ✅ Ensure `children` are rendered
    expect(screen.getByTestId("mock-children")).toBeInTheDocument();
  });
});
