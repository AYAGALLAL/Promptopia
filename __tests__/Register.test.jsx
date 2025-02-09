import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "@/app/register/page";
import { createUserWithEmailAndPassword } from "firebase/auth";

// ✅ Mock Firebase auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { email: "test@example.com" } })
  ),
}));

describe("Register Page", () => {
  test("renders the register form", () => {
    render(<Register />);

    // ✅ Fix: Use getByRole instead of getByText to avoid conflicts
    expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  test("allows users to register", async () => {
    render(<Register />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const registerButton = screen.getByRole("button", { name: /register/i });

    // ✅ Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "securepassword" } });

    // ✅ Click register button
    fireEvent.click(registerButton);

    // ✅ Ensure success message appears
    await waitFor(() =>
      expect(screen.getByText("User registered successfully!")).toBeInTheDocument()
    );
  });
});
