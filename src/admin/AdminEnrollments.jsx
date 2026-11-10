
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

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const perPage = 10;

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/enrollments.php", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load enrollments");
      }

      setEnrollments(data.enrollments || []);
      setSummary(data.summary || {});
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  const filteredEnrollments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return enrollments.filter((item) => {
      const matchesAccount =
        accountFilter === "all" ||
        item.account_status === accountFilter;

      const searchable = [
        item.id,
        item.user_id,
        item.course_id,
        item.order_id,
        item.student_name,
        item.student_email,
        item.course_title,
        item.razorpay_order_id,
        item.razorpay_payment_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesAccount && searchable.includes(term);
    });
  }, [enrollments, search, accountFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnrollments.length / perPage)
  );
  const currentPage = Math.min(page, totalPages);
  const visibleEnrollments = filteredEnrollments.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, accountFilter]);

  const cards = [
    {
      title: "Total Enrollments",
      value: summary.total_enrollments ?? enrollments.length,
      icon: "🎓",
    },
    {
      title: "Enrolled Students",
      value: summary.enrolled_students ?? 0,
      icon: "👨‍🎓",
    },
    {
      title: "Enrolled Courses",
      value: summary.enrolled_courses ?? 0,
      icon: "📚",
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
            <h1 className="text-3xl font-bold mt-2">
              Enrollments Management
            </h1>
            <p className="text-gray-400 mt-2">
              View students enrolled in your courses
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadEnrollments}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-[#171722] border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-400">{card.title}</p>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <h2 className="text-3xl font-bold mt-5">{card.value}</h2>
            </div>
          ))}
        </div>

        <div className="bg-[#171722] border border-white/10 rounded-2xl p-4 md:p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, email, course, enrollment or order ID..."
              className="flex-1 bg-[#0b0b12] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="bg-[#0b0b12] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            >
              <option value="all">All Accounts</option>
              <option value="active">Active Students</option>
              <option value="inactive">Inactive Students</option>
            </select>
          </div>
        </div>

        <div className="bg-[#171722] border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              Loading enrollments...
            </div>
          ) : visibleEnrollments.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No enrollments found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-sm">
                  <thead className="bg-white/5 text-gray-400">
                    <tr>
                      {[
                        "Enrollment",
                        "Student",
                        "Course",
                        "Order",
                        "Payment",
                        "Enrolled On",
                        "Action",
                      ].map((heading) => (
                        <th key={heading} className="text-left p-4 font-medium">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {visibleEnrollments.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-white/5 hover:bg-white/[0.02]"
                      >
                        <td className="p-4 font-semibold">#{item.id}</td>
                        <td className="p-4">
                          <p className="font-medium">
                            {item.student_name || "Unknown"}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {item.student_email || "—"}
                          </p>
                        </td>
                        <td className="p-4">
                          {item.course_title || "Course unavailable"}
                        </td>
                        <td className="p-4">#{item.order_id}</td>
                        <td className="p-4">
                          <div className="font-medium">
                            {money(item.amount_paise)}
                          </div>
                          <span
                            className={`text-xs capitalize ${
                              item.order_status === "paid"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {item.order_status || "Unknown"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">
                          {dateFormat(item.enrolled_at)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelected(item)}
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
                  Showing{" "}
                  {filteredEnrollments.length
                    ? (currentPage - 1) * perPage + 1
                    : 0}
                  {" "}to{" "}
                  {Math.min(
                    currentPage * perPage,
                    filteredEnrollments.length
                  )}
                  {" "}of {filteredEnrollments.length} enrollments
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
                <p className="text-purple-400 text-sm">Enrollment Details</p>
                <h2 className="text-2xl font-bold mt-1">
                  Enrollment #{selected.id}
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
                ["Student Email", selected.student_email],
                ["Student Account", selected.account_status],
                ["Course", selected.course_title],
                ["Course Slug", selected.course_slug],
                ["Enrollment ID", selected.id],
                ["Student ID", selected.user_id],
                ["Course ID", selected.course_id],
                ["Order ID", selected.order_id],
                ["Payment Status", selected.order_status],
                ["Paid Amount", money(selected.amount_paise)],
                ["Enrolled On", dateFormat(selected.enrolled_at)],
                ["Order Created", dateFormat(selected.order_created_at)],
                ["Razorpay Order ID", selected.razorpay_order_id],
                ["Razorpay Payment ID", selected.razorpay_payment_id],
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
