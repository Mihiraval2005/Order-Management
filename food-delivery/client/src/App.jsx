import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track/:id" element={<OrderTrackingPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
