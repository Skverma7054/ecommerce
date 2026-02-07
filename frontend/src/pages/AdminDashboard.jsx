import { useEffect, useState } from "react";
import api from "../api/client";

const initialForm = {
  title: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  images: "",
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setMessage("");
    try {
      const productResponse = await api.get("/api/products");
      setProducts(productResponse.data.data || []);
    } catch (error) {
      setMessage("Unable to load products.");
    }

    try {
      const ordersResponse = await api.get("/api/orders");
      setOrders(ordersResponse.data.data || []);
    } catch (error) {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await api.post("/api/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images ? form.images.split(",").map((img) => img.trim()) : [],
      });
      setForm(initialForm);
      await loadData();
      setMessage("Product created.");
    } catch (error) {
      setMessage("Admin access required to create products.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">
          Manage products and review customer orders.
        </p>
        {message && <p className="mt-2 text-sm text-amber-600">{message}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{product.title}</div>
                    <div className="text-xs text-slate-500">{product.category}</div>
                  </div>
                  <div className="text-sm font-semibold">${product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Create Product</h2>
          <form className="mt-3 space-y-2" onSubmit={handleCreate}>
            <input
              className="w-full rounded border border-slate-200"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <textarea
              className="w-full rounded border border-slate-200"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
            <input
              className="w-full rounded border border-slate-200"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="w-full rounded border border-slate-200"
                name="price"
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                className="w-full rounded border border-slate-200"
                name="stock"
                placeholder="Stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>
            <input
              className="w-full rounded border border-slate-200"
              name="images"
              placeholder="Image URLs (comma separated)"
              value={form.images}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-full rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
            >
              Save product
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <div className="mt-3 space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-slate-600">No orders available.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="rounded border border-slate-200 p-3">
                <div className="text-sm font-semibold">
                  Order #{order._id.slice(-6)}
                </div>
                <div className="text-xs text-slate-500">
                  Status: {order.status} · Total: ${order.totalAmount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
