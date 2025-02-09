import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../app/page";
import Feed from "../components/Feed";

// ✅ Mock the Feed component (so we don't test it here)
jest.mock("../components/Feed", () => () => <div data-testid="mock-feed"></div>);

describe("Home Page", () => {
  test("renders the page title", () => {
    render(<Home />);

    // ✅ Check for the main title
    expect(screen.getByText("Discover & Share")).toBeInTheDocument();
    expect(screen.getByText("AI Powered Prompts")).toBeInTheDocument();
  });

  test("renders the description", () => {
    render(<Home />);

    // ✅ Check for the description text
    expect(
      screen.getByText(
        "Promptopia is an open-source AI prompting tool for modern world to discover, create and share creative prompts"
      )
    ).toBeInTheDocument();
  });

  test("renders the Feed component", () => {
    render(<Home />);

    // ✅ Check if the mocked Feed component is rendered
    expect(screen.getByTestId("mock-feed")).toBeInTheDocument();
  });
});
