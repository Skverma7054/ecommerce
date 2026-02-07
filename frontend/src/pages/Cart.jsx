import { useEffect, useState } from "react";
import api from "../api/client";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    setMessage("");
    try {
      const response = await api.get("/api/cart");
      setCart(response.data.data);
    } catch (error) {
      setMessage("Login to view your cart.");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.put("/api/cart/update", { productId, quantity });
      setCart(response.data.data);
    } catch (error) {
      setMessage("Unable to update cart.");
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await api.delete("/api/cart/remove", {
        data: { productId },
      });
      setCart(response.data.data);
    } catch (error) {
      setMessage("Unable to remove item.");
    }
  };

  if (!cart) {
    return <p className="text-sm text-slate-600">{message || "Loading cart..."}</p>;
  }

  const total = cart.items.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Cart</h1>
          <p className="text-sm text-slate-600">Review items before checkout.</p>
        </div>
        <Link
          to="/checkout"
          className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
        >
          Go to checkout
        </Link>
      </header>
      {cart.items.length === 0 ? (
        <p className="text-sm text-slate-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div
              key={item.productId?._id || item.productId}
              className="flex items-center justify-between rounded border bg-white p-4 shadow-sm"
            >
              <div>
                <div className="font-semibold">
                  {item.productId?.title || "Product"}
                </div>
                <div className="text-xs text-slate-500">
                  ${item.productId?.price || 0} each
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.productId?._id || item.productId, event.target.value)
                  }
                  className="w-20 rounded border border-slate-200"
                />
                <button
                  onClick={() => removeItem(item.productId?._id || item.productId)}
                  className="rounded border border-red-200 px-3 py-1 text-xs text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="rounded border bg-white p-4 text-right shadow-sm">
        <span className="text-sm text-slate-600">Total:</span>
        <span className="ml-2 text-lg font-semibold">${total.toFixed(2)}</span>
      </div>
      {message && <p className="text-sm text-amber-600">{message}</p>}
    </section>
  );
}
