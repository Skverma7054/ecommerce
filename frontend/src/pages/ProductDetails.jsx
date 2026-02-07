import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setMessage("");
    try {
      await api.post("/api/cart/add", { productId: product._id, quantity: 1 });
      setMessage("Added to cart!");
    } catch (error) {
      setMessage("Login required to add items to cart.");
    }
  };

  if (!product) {
    return (
      <div>
        <p className="text-sm text-slate-600">Product not found.</p>
        <Link to="/" className="text-indigo-600">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase text-indigo-600">
          {product.category}
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {product.title}
        </h1>
        <p className="mt-4 text-slate-600">{product.description}</p>
      </div>
      <aside className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="text-2xl font-bold">${product.price}</div>
        <div className="mt-2 text-sm text-slate-500">Stock: {product.stock}</div>
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
        >
          Add to cart
        </button>
        {message && (
          <p className="mt-3 text-xs text-emerald-600">{message}</p>
        )}
      </aside>
    </section>
  );
}
