import { useEffect, useState } from "react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products");
        setProducts(response.data.data || []);
      } catch (error) {
        setStatus({ loading: false, error: "Unable to load products." });
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    setMessage("");
    try {
      await api.post("/api/cart/add", { productId: product._id, quantity: 1 });
      setMessage(`Added ${product.title} to cart.`);
    } catch (error) {
      setMessage("Login required to add items to cart.");
    }
  };

  if (status.loading) {
    return <p className="text-sm text-slate-600">Loading products...</p>;
  }

  if (status.error) {
    return <p className="text-sm text-red-500">{status.error}</p>;
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-slate-600">
            Browse the catalog and add items to your cart.
          </p>
        </div>
        {message && (
          <span className="rounded bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
            {message}
          </span>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} onAdd={handleAddToCart} />
        ))}
      </div>
    </section>
  );
}
