import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home Page", () => {
  test("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByText("Get started by editing")).toBeInTheDocument();
  });

  test("renders the Next.js logo", () => {
    render(<Home />);
    const logo = screen.getByAltText("Next.js Logo");
    expect(logo).toBeInTheDocument();
  });

  test("renders the Vercel link", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /by/i });
    expect(link).toBeInTheDocument();
  });
});
