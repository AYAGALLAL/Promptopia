import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "@/app/login/page";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

// ✅ Mock Next.js router (to prevent actual navigation)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// ✅ Mock Firebase Auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  signInWithEmailAndPassword: jest.fn(),
}));

describe("Login Page", () => {
  let mockPush;

  beforeEach(() => {
    // ✅ Reset the router mock before each test
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    // ✅ Reset Firebase mock
    signInWithEmailAndPassword.mockReset();
  });

  test("renders the login form", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("logs in successfully and redirects to profile", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: "test@example.com" },
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    // ✅ Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "securepassword" } });

    // ✅ Click login button
    fireEvent.click(loginButton);

    // ✅ Wait for async login to complete
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object), // Mocked Firebase auth object
        "test@example.com",
        "securepassword"
      );
    });

    // ✅ Ensure redirection to "/profile"
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/profile"));
  });

  test("displays an error message on login failure", async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    fireEvent.click(loginButton);

    // ✅ Wait for error message
    await waitFor(() => expect(screen.getByText("Invalid credentials")).toBeInTheDocument());
  });
});
