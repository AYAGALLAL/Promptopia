import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "../app/profile/page";

// ✅ Mock `useAuth` Hook to simulate an authenticated user
jest.mock("../lib/useauth", () => ({
  useAuth: jest.fn(() => ({
    user: { email: "test@example.com" },
    loading: false,
  })),
}));

// ✅ Mock `getUserPrompts` to return fake prompts
jest.mock("../models/prompt", () => ({
  getUserPrompts: jest.fn(() =>
    Promise.resolve([
      { id: "1", prompt: "User Prompt 1", tag: "test" },
      { id: "2", prompt: "User Prompt 2", tag: "code" },
    ])
  ),
}));

// ✅ Mock Next.js Router (Fix `usePathname` issue)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(), // Mock `router.push()`
  })),
  usePathname: jest.fn(() => "/mock-path"), // Mock `usePathname()`
}));


describe("Profile Page", () => {
  test("displays user prompts when authenticated", async () => {
    render(<Profile />);

    // ✅ Wait for the profile page to load prompts
    await waitFor(() => {
      expect(screen.getByText("User Prompt 1")).toBeInTheDocument();
      expect(screen.getByText("User Prompt 2")).toBeInTheDocument();
    });
  });
});
