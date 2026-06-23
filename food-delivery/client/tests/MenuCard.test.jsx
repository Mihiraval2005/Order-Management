import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MenuCard from "../src/components/Menu/MenuCard";
import { CartProvider } from "../src/context/CartContext";

const mockItem = {
  id: 1,
  name: "Margherita Pizza",
  description: "Classic pizza with tomato and mozzarella",
  price: "12.99",
  image_url: "https://example.com/pizza.jpg",
  category: "Pizza",
};

const renderWithCart = (ui) => render(<CartProvider>{ui}</CartProvider>);

describe("MenuCard", () => {
  it("renders menu item details correctly", () => {
    renderWithCart(<MenuCard item={mockItem} />);
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("Classic pizza with tomato and mozzarella")).toBeInTheDocument();
    expect(screen.getByText("₹12.99")).toBeInTheDocument();
    expect(screen.getByText("Pizza")).toBeInTheDocument();
  });

  it("shows '+ Add' button initially", () => {
    renderWithCart(<MenuCard item={mockItem} />);
    expect(screen.getByText("+ Add")).toBeInTheDocument();
  });

  it("updates button text after adding to cart", () => {
    renderWithCart(<MenuCard item={mockItem} />);
    fireEvent.click(screen.getByText("+ Add"));
    expect(screen.getByText(/In cart/)).toBeInTheDocument();
  });
});
