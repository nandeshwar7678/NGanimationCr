
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // First verify admin session
        const adminResponse = await fetch(
          "/api/admin/admin-check.php",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const adminData = await adminResponse.json();

        if (!adminResponse.ok || !adminData.success) {
          throw new Error(
            adminData.message || "Admin verification failed."
          );
        }

        const verifiedUser = adminData.user;

        if (
          String(verifiedUser?.role || "").toLowerCase() !== "admin"
        ) {
          throw new Error("You are not authorized to access this page.");
        }

        if (!cancelled) {
          setAdmin(verifiedUser);
        }

        // Load statistics only after admin verification
        const response = await fetch(
          "/api/admin/dashboard-stats.php",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load dashboard statistics."
          );
        }

        if (!cancelled) {
          setStats(data.stats || {});
        }

      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load Admin Dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
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
      <div className="min-h-screen flex items-center justify-center bg-[#09090f] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
          <p>Verifying admin and loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#09090f] px-5 text-center text-white">
        <div className="text-5xl">🔒</div>

        <h1 className="text-2xl font-bold">
          Dashboard Access
        </h1>

        <p className="max-w-lg text-red-400">
          {error}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/login")}
            className="rounded-lg border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
          >
            Go to Login
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090f] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Dashboard Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-400">
              NGAnimationCR Academy
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-400">
              Welcome, {admin?.name || "Admin"}
            </p>
          </div>

          <Link
            to="/courses"
            className="rounded-xl bg-purple-600 px-5 py-3 text-center transition hover:bg-purple-700"
          >
            View Website →
          </Link>
        </div>

        {/* Overview */}
        <h2 className="mb-5 text-xl font-semibold">
          Overview
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-[#171722] p-6 transition hover:border-purple-500/50"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  {card.title}
                </p>

                <span className="text-3xl">
                  {card.icon}
                </span>
              </div>

              <h3 className="mt-5 text-3xl font-bold">
                {card.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Management */}
        <div className="mt-12">
          <h2 className="mb-5 text-xl font-semibold">
            Management
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <Link
              to="/admin/courses"
              className="rounded-2xl border border-white/10 bg-[#171722] p-6 transition hover:border-purple-500"
            >
              <span className="text-3xl">📚</span>
              <h3 className="mt-3 text-lg font-semibold">Courses</h3>
              <p className="mt-1 text-sm text-gray-400">
                Add, edit and manage courses
              </p>
            </Link>

            <Link
              to="/admin/lessons"
              className="rounded-2xl border border-white/10 bg-[#171722] p-6 transition hover:border-purple-500"
            >
              <span className="text-3xl">🎬</span>
              <h3 className="mt-3 text-lg font-semibold">
                Lessons & Videos
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Add lessons and manage video links
              </p>
            </Link>

            <Link
              to="/admin/students"
              className="rounded-2xl border border-white/10 bg-[#171722] p-6 transition hover:border-purple-500"
            >
              <span className="text-3xl">👨‍🎓</span>
              <h3 className="mt-3 text-lg font-semibold">Students</h3>
              <p className="mt-1 text-sm text-gray-400">
                View and manage registered students
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="rounded-2xl border border-white/10 bg-[#171722] p-6 transition hover:border-purple-500"
            >
              <span className="text-3xl">💳</span>
              <h3 className="mt-3 text-lg font-semibold">Orders</h3>
              <p className="mt-1 text-sm text-gray-400">
                View payment orders and transaction details
              </p>
            </Link>

            <Link
              to="/admin/enrollments"
              className="rounded-2xl border border-white/10 bg-[#171722] p-6 transition hover:border-purple-500"
            >
              <span className="text-3xl">🎓</span>
              <h3 className="mt-3 text-lg font-semibold">
                Enrollments
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                View enrolled students and course details
              </p>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
