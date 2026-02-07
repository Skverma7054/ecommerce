import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="flex h-full flex-col rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex-1">
        <div className="mb-2 text-xs font-semibold uppercase text-indigo-600">
          {product.category}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">
          {product.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold">${product.price}</span>
        <div className="flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
          >
            Details
          </Link>
          <button
            onClick={() => onAdd(product)}
            className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-500"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
