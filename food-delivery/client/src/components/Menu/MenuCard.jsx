import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const MenuCard = ({ item }) => {
  const { addItem, cart } = useCart();
  const inCart = cart.find((i) => i.id === item.id);

  const handleAdd = () => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="menu-card">
      <img src={item.image_url} alt={item.name} className="menu-card__img" />
      <div className="menu-card__body">
        <span className="menu-card__category">{item.category}</span>
        <h3 className="menu-card__name">{item.name}</h3>
        <p className="menu-card__desc">{item.description}</p>
        <div className="menu-card__footer">
          <span className="menu-card__price">₹{parseFloat(item.price).toFixed(2)}</span>
          <button onClick={handleAdd} className={`btn btn--add ${inCart ? "btn--in-cart" : ""}`}>
            {inCart ? `In cart (${inCart.quantity})` : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
