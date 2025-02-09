import React from 'react'
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Nav from "../components/Nav"; // Adjust the path if needed
import { useAuth } from "../lib/useauth";
import { useRouter } from "next/navigation";

// 🛠 Mock `useRouter` from Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// 🛠 Mock `useAuth` (Firebase authentication)
jest.mock("../lib/useauth", () => ({
  useAuth: jest.fn(),
}));

describe("Nav Component", () => {
  test("renders correctly for unauthenticated users", () => {
    useAuth.mockReturnValue({ user: null }); // Simulate logged-out state

    render(<Nav />);

    expect(screen.getAllByText("Sign In").length).toBeGreaterThan(0);    
    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
  });

  test("renders correctly for authenticated users", () => {
    useAuth.mockReturnValue({ user: { uid: "12345", email: "test@example.com" } }); // Simulate logged-in state

    render(<Nav />);

    expect(screen.getByText("Create Prompt")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });

  test("calls logout function when Sign Out is clicked", async () => {
    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);
    useAuth.mockReturnValue({ user: { uid: "12345", email: "test@example.com" } });

    render(<Nav />);

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton); // Simulate clicking "Sign Out"

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/register");
    });
  });
});

