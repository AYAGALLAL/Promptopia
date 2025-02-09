import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreatePrompt from "../app/create-prompt/page";

// ✅ Mock `useAuth` Hook to simulate an authenticated user
jest.mock("../lib/useauth", () => ({
  useAuth: jest.fn(() => ({
    user: { uid: "12345", email: "test@example.com" }, // Mocked user
    loading: false,
  })),
}));

// ✅ Mock `createPrompt` function
jest.mock("../models/prompt", () => ({
  createPrompt: jest.fn(() => Promise.resolve({ success: true })),
}));

// ✅ Mock Next.js Router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush, // Mock `router.push`
  }),
}));

describe("CreatePrompt Page", () => {
  test("renders the form correctly", () => {
    render(<CreatePrompt />);

    expect(screen.getByText("Post")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Write your post here")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("#Tag")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  test("allows user to type in inputs", () => {
    render(<CreatePrompt />);

    const promptInput = screen.getByPlaceholderText("Write your post here");
    const tagInput = screen.getByPlaceholderText("#Tag");

    fireEvent.change(promptInput, { target: { value: "My AI Prompt" } });
    fireEvent.change(tagInput, { target: { value: "#AI" } });

    expect(promptInput).toHaveValue("My AI Prompt");
    expect(tagInput).toHaveValue("#AI");
  });

  test("submits the form and redirects to home page", async () => {
    render(<CreatePrompt />);

    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "This is a test prompt" },
    });

    fireEvent.change(screen.getByPlaceholderText("#Tag"), {
      target: { value: "#testing" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /create/i }));
    });

    // ✅ Ensure `createPrompt` was called
    await waitFor(() => {
      expect(require("../models/prompt").createPrompt).toHaveBeenCalledWith(
        "12345", // Mocked user ID
        "This is a test prompt",
        "#testing"
      );
    });

    // ✅ Ensure router redirects to home page
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
