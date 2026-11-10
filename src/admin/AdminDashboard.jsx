
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats.php", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load dashboard");
        }

        setStats(data.stats);

        const adminResponse = await fetch("/api/admin/admin-check.php", {
          credentials: "include",
        });

        const adminData = await adminResponse.json();

        if (!adminResponse.ok || !adminData.success) {
          throw new Error(adminData.message || "Admin verification failed");
        }

        setAdmin(adminData.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Students",
      value: stats?.total_students ?? 0,
      icon: "👨‍🎓",
    },
    {
      title: "Total Courses",
      value: stats?.total_courses ?? 0,
      icon: "📚",
    },
    {
      title: "Enrollments",
      value: stats?.total_enrollments ?? 0,
      icon: "🎓",
    },
    {
      title: "Paid Orders",
      value: stats?.paid_orders ?? 0,
      icon: "💳",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(
        stats?.total_revenue ?? 0
      ).toLocaleString("en-IN")}`,
      icon: "💰",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Admin Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-red-400">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-lg bg-purple-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090f] text-white px-4 py-10 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-purple-400 text-sm font-semibold">
              NGAnimationCR Academy
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Welcome, {admin?.name}
            </p>
          </div>

          <Link
            to="/courses"
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-center"
          >
            View Website →
          </Link>
        </div>

        {/* Overview */}
        <h2 className="text-xl font-semibold mb-5">
          Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-[#171722] border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  {card.title}
                </p>

                <span className="text-3xl">
                  {card.icon}
                </span>
              </div>

              <h3 className="text-3xl font-bold mt-5">
                {card.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Management */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-5">
            Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Courses */}
            <Link
              to="/admin/courses"
              className="bg-[#171722] border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"
            >
              <span className="text-3xl">📚</span>

              <h3 className="text-lg font-semibold mt-3">
                Courses
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Add, edit and manage courses
              </p>
            </Link>

            {/* Lessons */}
            <Link
              to="/admin/lessons"
              className="bg-[#171722] border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"
            >
              <span className="text-3xl">🎬</span>

              <h3 className="text-lg font-semibold mt-3">
                Lessons & Videos
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Add lessons and manage video links
              </p>
            </Link>

            {/* Students */}
            <Link
              to="/admin/students"
              className="bg-[#171722] border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"
            >
              <span className="text-3xl">👨‍🎓</span>

              <h3 className="text-lg font-semibold mt-3">
                Students
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                View and manage registered students
              </p>
            </Link>

            {/* Orders */}
            <Link
              to="/admin/orders"
              className="bg-[#171722] border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"
            >
              <span className="text-3xl">💳</span>
              <h3 className="text-lg font-semibold mt-3">Orders</h3>
              <p className="text-gray-400 text-sm mt-1">
                View payment orders and transaction details
              </p>
            </Link>

            {/* Enrollments */}
            <Link
              to="/admin/enrollments"
              className="bg-[#171722] border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"
            >
              <span className="text-3xl">🎓</span>
              <h3 className="text-lg font-semibold mt-3">Enrollments</h3>
              <p className="text-gray-400 text-sm mt-1">
                View enrolled students and course details
              </p>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
