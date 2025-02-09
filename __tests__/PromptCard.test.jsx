import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptCard from "../components/PromptCard"; // Adjust path if needed
import { useRouter, usePathname } from "next/navigation";
import { deletePrompt } from "../models/prompt";

// 🛠 Mock `useRouter` and `usePathname`
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => "/mock-path"), // ✅ Fix: Properly mock usePathname
}));

// 🛠 Mock `deletePrompt` function
jest.mock("../models/prompt", () => ({
  deletePrompt: jest.fn(),
}));

beforeAll(() => {
  // ✅ Mock `navigator.clipboard.writeText` to prevent errors
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: jest.fn(),
    },
    writable: true,
  });
});


describe("PromptCard Component", () => {
  const mockPost = {
    id: "123",
    prompt: "This is a test prompt",
    tag: "testing",
    creator: { _id: "user1", username: "TestUser" },
  };

  const mockHandleTagClick = jest.fn();

  test("renders correctly with given post", () => {
    render(<PromptCard post={mockPost} handleTagClick={mockHandleTagClick} />);

    expect(screen.getByText("This is a test prompt")).toBeInTheDocument();
    expect(screen.getByText("#testing")).toBeInTheDocument();
  });

  test("copies prompt to clipboard when copy button is clicked", async () => {
    render(<PromptCard post={mockPost} handleTagClick={mockHandleTagClick} />);
  
    const copyButton = screen.getByAltText("copy_icon");
    fireEvent.click(copyButton);
  
    // ✅ Ensure clipboard mock was called with correct text
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPost.prompt);
  });
  
  test("calls handleTagClick when the tag is clicked", () => {
    render(<PromptCard post={mockPost} handleTagClick={mockHandleTagClick} />);

    const tagElement = screen.getByText("#testing");
    fireEvent.click(tagElement);

    expect(mockHandleTagClick).toHaveBeenCalledWith(mockPost.tag);
  });

  test("navigates to edit page when Edit is clicked", () => {
    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    render(<PromptCard post={mockPost} handleTagClick={mockHandleTagClick} />);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(mockRouter.push).toHaveBeenCalledWith(`/update-prompt?Id=${mockPost.id}`);
  });

  test("calls deletePrompt when Delete is clicked", () => {
    render(<PromptCard post={mockPost} handleTagClick={mockHandleTagClick} />);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(deletePrompt).toHaveBeenCalledWith(mockPost.id);
  });
});
