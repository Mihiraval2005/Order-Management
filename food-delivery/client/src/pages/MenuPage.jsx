import { useState } from "react";
import MenuList from "../components/Menu/MenuList";
import Cart from "../components/Cart/Cart";
import { useCart } from "../context/CartContext";

const MenuPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="page">
      <header className="header">
        <div className="header__brand">🍕 QuickBite</div>
        <button className="cart-toggle" onClick={() => setCartOpen(!cartOpen)}>
          🛒 Cart
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </header>

      <main className="main-layout">
        <div className="menu-section">
          <h1>Our Menu</h1>
          <p className="subtitle">Fresh food, delivered fast</p>
          <MenuList />
        </div>

        <aside className={`cart-panel ${cartOpen ? "cart-panel--open" : ""}`}>
          <Cart onClose={() => setCartOpen(false)} />
        </aside>
      </main>
    </div>
  );
};

export default MenuPage;
