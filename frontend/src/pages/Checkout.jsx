import { useState } from "react";
import api from "../api/client";

export default function Checkout() {
  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleCheckout = async () => {
    setStatus({ loading: true, message: "" });
    try {
      const response = await api.post("/api/orders");
      setStatus({
        loading: false,
        message: `Order placed. Total: $${response.data.data.totalAmount}`,
      });
    } catch (error) {
      setStatus({ loading: false, message: "Login and add items before checkout." });
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-2 text-sm text-slate-600">
          This demo checkout creates an order from your cart.
        </p>
        <button
          onClick={handleCheckout}
          disabled={status.loading}
          className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {status.loading ? "Processing..." : "Place order"}
        </button>
        {status.message && (
          <p className="mt-3 text-sm text-emerald-600">{status.message}</p>
        )}
      </div>
    </section>
  );
}
