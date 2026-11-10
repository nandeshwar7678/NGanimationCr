
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const money = (paise) =>
  "₹" + (Number(paise || 0) / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const dateFormat = (date) => {
  if (!date) return "—";
  return new Date(date.replace(" ", "T")).toLocaleString("en-IN");
};

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [notice, setNotice] = useState("");

  const pageSize = 10;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/students.php", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load students.");
      }

      setStudents(data.students || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        `${student.id} ${student.name} ${student.email}`
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        student.account_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / pageSize)
  );

  const currentStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const activeCount = students.filter(
    (s) => s.account_status === "active"
  ).length;

  const inactiveCount = students.filter(
    (s) => s.account_status === "inactive"
  ).length;

  const totalRevenue = students.reduce(
    (sum, s) => sum + Number(s.total_paid_paise || 0),
    0
  );

  const openDetails = async (student) => {
    setSelected(student);
    setDetails(null);
    setDetailError("");

    try {
      setDetailLoading(true);

      const response = await fetch(
        `/api/admin/student-details.php?id=${student.id}`,
        { credentials: "include" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load details.");
      }

      setDetails(data);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const changeStatus = async (student) => {
    const nextStatus =
      student.account_status === "active" ? "inactive" : "active";

    const confirmed = window.confirm(
      `Are you sure you want to ${nextStatus === "inactive" ? "deactivate" : "activate"} ${student.name}?`
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      setNotice("");

      const response = await fetch("/api/admin/student-status.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.id,
          account_status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update status.");
      }

      setStudents((prev) =>
        prev.map((s) =>
          Number(s.id) === Number(student.id)
            ? { ...s, account_status: nextStatus }
            : s
        )
      );

      setSelected((prev) =>
        prev && Number(prev.id) === Number(student.id)
          ? { ...prev, account_status: nextStatus }
          : prev
      );

      setDetails((prev) =>
        prev
          ? {
              ...prev,
              student: {
                ...prev.student,
                account_status: nextStatus,
              },
            }
          : prev
      );

      setNotice(`${student.name} is now ${nextStatus}.`);
    } catch (err) {
      window.alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const closeDetails = () => {
    setSelected(null);
    setDetails(null);
    setDetailError("");
  };

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <Link
              to="/admin/dashboard"
              className="text-purple-400 text-sm hover:text-purple-300"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mt-3">
              Student Management
            </h1>

            <p className="text-gray-400 mt-1">
              Manage students, enrollments and payments.
            </p>
          </div>

          <button
            onClick={fetchStudents}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-5 py-3 rounded-xl"
          >
            ↻ {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {notice && (
          <div className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl p-3 mb-5">
            {notice}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 text-red-400 rounded-xl p-4 mb-5">
            {error}
            <button
              onClick={fetchStudents}
              className="underline ml-3"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat title="Total Students" value={students.length} />
          <Stat title="Active Students" value={activeCount} />
          <Stat title="Inactive Students" value={inactiveCount} />
          <Stat title="Total Paid Revenue" value={money(totalRevenue)} />
        </div>

        <div className="bg-[#171722] border border-white/10 rounded-2xl p-5">
          <div className="flex flex-col lg:flex-row gap-3 justify-between mb-6">
            <h2 className="text-xl font-semibold">
              All Students
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, email or ID..."
                className="bg-[#0b0b12] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-[#0b0b12] border border-white/10 rounded-xl px-4 py-3 outline-none"
              >
                <option value="all">All Students</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-10">
              Loading students...
            </p>
          ) : !error && currentStudents.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              No students found.
            </p>
          ) : !error ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[950px]">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-white/10">
                    <th className="p-3">Student</th>
                    <th className="p-3">Registered</th>
                    <th className="p-3">Courses</th>
                    <th className="p-3">Paid Orders</th>
                    <th className="p-3">Total Paid</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="p-3">
                        <div className="font-semibold">
                          {student.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {student.email}
                        </div>
                        <div className="text-gray-500 text-xs">
                          ID: #{student.id}
                        </div>
                      </td>

                      <td className="p-3 text-sm text-gray-300">
                        {dateFormat(student.created_at)}
                      </td>

                      <td className="p-3">
                        {student.total_enrollments}
                      </td>

                      <td className="p-3">
                        {student.paid_orders}
                      </td>

                      <td className="p-3 text-green-400 font-semibold">
                        {money(student.total_paid_paise)}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            student.account_status === "active"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {student.account_status}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetails(student)}
                            className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-xs"
                          >
                            Details
                          </button>

                          <button
                            disabled={updating}
                            onClick={() => changeStatus(student)}
                            className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-xs"
                          >
                            {student.account_status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!loading && !error && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm">
              <p className="text-gray-400">
                Showing {filteredStudents.length === 0 ? 0 : (page - 1) * pageSize + 1}
                {" - "}
                {Math.min(page * pageSize, filteredStudents.length)}
                {" of "}
                {filteredStudents.length} students
              </p>

              <div className="flex gap-2 items-center">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="text-gray-300">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
            <div className="bg-[#171722] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-5 md:p-7">

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Student Profile
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Student ID: #{selected.id}
                  </p>
                </div>

                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>

              {detailLoading ? (
                <p className="text-center text-gray-400 py-10">
                  Loading details...
                </p>
              ) : detailError ? (
                <p className="text-red-400 py-8">{detailError}</p>
              ) : details ? (
                <>
                  <div className="bg-[#0b0b12] rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center">
                    {details.student.profile_photo ? (
                      <img
                        src={details.student.profile_photo}
                        alt=""
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl">
                        {details.student.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-bold">
                        {details.student.name}
                      </h3>
                      <p className="text-gray-400">
                        {details.student.email}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Registered: {dateFormat(details.student.created_at)}
                      </p>
                    </div>

                    <span className="text-sm text-purple-300">
                      {details.student.account_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                    <Stat
                      title="Enrollments"
                      value={details.total_enrollments}
                    />
                    <Stat
                      title="Paid Orders"
                      value={details.summary.paid_orders || 0}
                    />
                    <Stat
                      title="Pending Orders"
                      value={details.summary.pending_orders || 0}
                    />
                    <Stat
                      title="Total Paid"
                      value={money(details.summary.total_paid_paise)}
                    />
                  </div>

                  <section className="mt-7">
                    <h3 className="text-lg font-semibold mb-3">
                      Enrolled Courses
                    </h3>

                    {details.courses.length === 0 ? (
                      <p className="text-gray-400">
                        No courses enrolled.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {details.courses.map((course, index) => (
                          <div
                            key={`${course.id}-${index}`}
                            className="bg-[#0b0b12] border border-white/10 rounded-xl p-4"
                          >
                            <h4 className="font-semibold">
                              {course.title}
                            </h4>
                            <p className="text-gray-400 text-sm mt-1">
                              Course ID: {course.id}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Enrolled: {dateFormat(course.enrolled_at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="mt-7">
                    <h3 className="text-lg font-semibold mb-3">
                      Order & Payment History
                    </h3>

                    {details.orders.length === 0 ? (
                      <p className="text-gray-400">
                        No orders found.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[650px]">
                          <thead>
                            <tr className="text-gray-400 text-sm border-b border-white/10">
                              <th className="p-3">Order ID</th>
                              <th className="p-3">Course</th>
                              <th className="p-3">Amount</th>
                              <th className="p-3">Status</th>
                              <th className="p-3">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {details.orders.map((order) => (
                              <tr
                                key={order.id}
                                className="border-b border-white/5"
                              >
                                <td className="p-3 text-sm">
                                  #{order.id}
                                </td>
                                <td className="p-3 text-sm">
                                  {order.course_title || "Course unavailable"}
                                </td>
                                <td className="p-3">
                                  {money(order.amount_paise)}
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      order.status === "paid"
                                        ? "bg-green-500/10 text-green-400"
                                        : order.status === "pending"
                                        ? "bg-yellow-500/10 text-yellow-400"
                                        : "bg-red-500/10 text-red-400"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td className="p-3 text-xs text-gray-400">
                                  {dateFormat(order.created_at)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>

                  <div className="flex flex-wrap gap-3 mt-7">
                    <button
                      disabled={updating}
                      onClick={() => changeStatus(details.student)}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-5 py-3 rounded-xl"
                    >
                      {updating
                        ? "Updating..."
                        : details.student.account_status === "active"
                        ? "Deactivate Student"
                        : "Activate Student"}
                    </button>

                    <button
                      onClick={closeDetails}
                      className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-[#171722] border border-white/10 rounded-xl p-4">
      <p className="text-gray-400 text-xs">{title}</p>
      <h3 className="text-xl md:text-2xl font-bold mt-2 break-words">
        {value}
      </h3>
    </div>
  );
}
