import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CheckoutForm from "../src/components/Checkout/CheckoutForm";
import { CartProvider } from "../src/context/CartContext";
import { BrowserRouter } from "react-router-dom";

vi.mock("../src/services/api", () => ({
  placeOrder: vi.fn().mockResolvedValue({ data: { id: 1 } }),
}));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));

const renderCheckout = () =>
  render(
    <BrowserRouter>
      <CartProvider>
        <CheckoutForm />
      </CartProvider>
    </BrowserRouter>
  );

describe("CheckoutForm", () => {
  it("renders all delivery detail fields", () => {
    renderCheckout();
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Delivery Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    renderCheckout();
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least/i)).toBeInTheDocument();
      expect(screen.getByText(/valid address/i)).toBeInTheDocument();
      expect(screen.getByText(/valid phone/i)).toBeInTheDocument();
    });
  });

  it("shows error for short name", async () => {
    renderCheckout();
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "A" } });
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least/i)).toBeInTheDocument();
    });
  });
});
