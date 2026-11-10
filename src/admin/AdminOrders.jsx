
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const money = (paise) =>
  `₹${(Number(paise || 0) / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const dateFormat = (value) => {
  if (!value) return "—";
  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const statusStyle = {
  paid: "bg-green-500/15 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  failed: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const perPage = 10;

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/orders.php", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load orders");
      }

      setOrders(data.orders || []);
      setSummary(data.summary || {});
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        status === "all" || order.status === status;

      const searchable = [
        order.id,
        order.student_name,
        order.student_email,
        order.course_title,
        order.razorpay_order_id,
        order.razorpay_payment_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchable.includes(term);
    });
  }, [orders, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const visibleOrders = filteredOrders.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const statCards = [
    {
      title: "Total Orders",
      value: summary.total_orders ?? orders.length,
      icon: "📦",
    },
    {
      title: "Paid Orders",
      value: summary.paid_orders ?? 0,
      icon: "✅",
    },
    {
      title: "Pending Orders",
      value: summary.pending_orders ?? 0,
      icon: "⏳",
    },
    {
      title: "Failed Orders",
      value: summary.failed_orders ?? 0,
      icon: "❌",
    },
    {
      title: "Total Revenue",
      value: money(summary.total_revenue_paise),
      icon: "💰",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090f] text-white px-4 py-10 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-purple-400 text-sm font-semibold">
              NGAnimationCR Academy
            </p>
            <h1 className="text-3xl font-bold mt-2">Orders Management</h1>
            <p className="text-gray-400 mt-2">
              View and track all course payment orders
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadOrders}
              disabled={loading}
              className="px-4 py-3 rounded-xl border border-white/10 hover:border-purple-500 disabled:opacity-50"
            >
              ↻ Refresh
            </button>
            <Link
              to="/admin"
              className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-center"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-[#171722] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm">{card.title}</p>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <h2 className="text-2xl font-bold mt-4">{card.value}</h2>
            </div>
          ))}
        </div>

        <div className="bg-[#171722] border border-white/10 rounded-2xl p-4 md:p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, student, email, course or payment ID..."
              className="flex-1 bg-[#0b0b12] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#0b0b12] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="bg-[#171722] border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              Loading orders...
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No orders found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-sm">
                  <thead className="bg-white/5 text-gray-400">
                    <tr>
                      {[
                        "Order",
                        "Student",
                        "Course",
                        "Amount",
                        "Status",
                        "Date",
                        "Action",
                      ].map((heading) => (
                        <th key={heading} className="text-left p-4 font-medium">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-white/5 hover:bg-white/[0.02]"
                      >
                        <td className="p-4 font-semibold">#{order.id}</td>
                        <td className="p-4">
                          <p className="font-medium">{order.student_name || "Unknown"}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {order.student_email || "—"}
                          </p>
                        </td>
                        <td className="p-4">{order.course_title || "Course unavailable"}</td>
                        <td className="p-4 font-semibold">{money(order.amount_paise)}</td>
                        <td className="p-4">
                          <span
                            className={`inline-block border rounded-full px-3 py-1 text-xs capitalize ${
                              statusStyle[order.status] ||
                              "bg-gray-500/15 text-gray-300 border-gray-500/30"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">
                          {dateFormat(order.created_at)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelected(order)}
                            className="text-purple-400 hover:text-purple-300 font-medium"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  Showing {filteredOrders.length ? (currentPage - 1) * perPage + 1 : 0}
                  {" "}to{" "}
                  {Math.min(currentPage * perPage, filteredOrders.length)}
                  {" "}of {filteredOrders.length} orders
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg bg-white/5 disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-gray-300">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-lg bg-white/5 disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#171722] border border-white/10 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-purple-400 text-sm">Order Details</p>
                <h2 className="text-2xl font-bold mt-1">
                  Order #{selected.id}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white text-2xl"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["Student", selected.student_name],
                ["Email", selected.student_email],
                ["Course", selected.course_title],
                ["Amount", money(selected.amount_paise)],
                ["Order Status", selected.status],
                ["Account Status", selected.account_status],
                ["Order Date", dateFormat(selected.created_at)],
                ["Order ID", selected.razorpay_order_id],
                ["Payment ID", selected.razorpay_payment_id],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#0b0b12] rounded-xl p-4 min-w-0">
                  <p className="text-xs text-gray-500 mb-2">{label}</p>
                  <p className="text-sm break-all">{value || "—"}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl bg-purple-600 hover:bg-purple-700 py-3"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
