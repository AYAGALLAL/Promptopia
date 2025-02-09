import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import UpdatePrompt from "../app/update-prompt/page";

// ✅ Mock `getOnePrompt` and `updatePrompt` functions
jest.mock("../models/prompt", () => ({
  getOnePrompt: jest.fn(() =>
    Promise.resolve({ id: "1", prompt: "Initial Prompt", tag: "#test" })
  ),
  updatePrompt: jest.fn(() => Promise.resolve({ success: true })),
}));

// ✅ Mock Next.js Router and useSearchParams
const mockPush = jest.fn();
const mockSearchParams = { get: jest.fn(() => "1") }; // Mock query parameter "Id=1"

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush, // Mock `router.push`
  }),
  useSearchParams: () => mockSearchParams,
}));

describe("UpdatePrompt Page", () => {
  test("renders the form correctly", async () => {
    await act(async () => {
      render(<UpdatePrompt />);
    });

    expect(screen.getByText("Edit Post")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Write your post here")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("#Tag")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  test("fetches and displays existing prompt details", async () => {
    await act(async () => {
      render(<UpdatePrompt />);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Write your post here")).toHaveValue("Initial Prompt");
      expect(screen.getByPlaceholderText("#Tag")).toHaveValue("#test");
    });
  });

  test("allows user to update the prompt and submit the form", async () => {
    await act(async () => {
      render(<UpdatePrompt />);
    });

    const promptInput = screen.getByPlaceholderText("Write your post here");
    const tagInput = screen.getByPlaceholderText("#Tag");

    fireEvent.change(promptInput, { target: { value: "Updated Prompt" } });
    fireEvent.change(tagInput, { target: { value: "#updated" } });

    expect(promptInput).toHaveValue("Updated Prompt");
    expect(tagInput).toHaveValue("#updated");

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /update/i }));
    });

    // ✅ Ensure `updatePrompt` was called with updated values
    await waitFor(() => {
      expect(require("../models/prompt").updatePrompt).toHaveBeenCalledWith(
        "1", // Prompt ID from URL
        "Updated Prompt",
        "#updated"
      );
    });

    // ✅ Ensure it redirects to home page
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("shows an alert if no ID is found", async () => {
    mockSearchParams.get = jest.fn(() => null); // Simulate missing Id

    window.alert = jest.fn(); // Mock alert

    await act(async () => {
      render(<UpdatePrompt />);
    });

    fireEvent.submit(screen.getByRole("button", { name: /update/i }));

    expect(window.alert).toHaveBeenCalledWith("Missing PromptId!");
  });
});
