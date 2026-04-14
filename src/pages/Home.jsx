import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    const res = await api.get(
      `/products?search=${search}&category=${category}`,
    );
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to add items to cart.");
      return;
    }
    const res = await api.post("/cart/add", { userId, productId });
    const total = res.data.cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0,
    );

    localStorage.setItem("cartCount", total);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="p-6">
      {/* Search */}
      <div className="mb-4 flex gap-3">
        <input
          placeholder="Search products.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Laptop">Laptop</option>
          <option value="Mobiles">Mobiles</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <div key={product._id} className="border rounded p-4 hover:shadow">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                className="w-full h-40 object-contain bg-white rounded"
              />
              <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
              <p> ${product.price}</p>
            </Link>
            <button
              onClick={() => addToCart(product._id)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
      
  





