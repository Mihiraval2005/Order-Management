import { useState, useEffect } from "react";
import { fetchMenu } from "../../services/api";
import MenuCard from "./MenuCard";

const MenuList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchMenu()
      .then(setItems)
      .catch(() => setError("Failed to load menu. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const filtered = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  if (loading) return <div className="loader">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? "category-tab--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuList;
