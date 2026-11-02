
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MyLearning() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(
          "/api/auth/me.php",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          navigate("/login", { replace: true });
          return;
        }

        setUser(data.user);
      } catch (err) {
        setError("Unable to connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
       "/api/auth/logout.php",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Logout failed.");
        return;
      }

      navigate("/login", { replace: true });
    } catch (err) {
      setError("Unable to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Checking your account...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 px-5 text-white">
        <p className="text-center text-red-300">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-purple-600 px-6 py-3 font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-14 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-semibold uppercase tracking-widest text-purple-400">
              NGAnimationCR Academy
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              My Learning
            </h1>

            <p className="mt-3 text-slate-400">
              Welcome back, {user.name}!
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500/50 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">My Courses</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Completed Courses</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Learning Status</p>
            <h2 className="mt-3 text-xl font-bold text-purple-400">
              Ready to Start
            </h2>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">My Purchased Courses</h2>

          <Link
            to="/courses"
            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700"
          >
            Explore Courses
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
          <div className="text-5xl">🎓</div>

          <h3 className="mt-5 text-xl font-bold">
            Your Learning Journey Starts Here
          </h3>

          <p className="mt-3 text-sm text-slate-400">
            You haven't enrolled in any courses yet.
            Explore our courses and start learning.
          </p>

          <Link
            to="/courses"
            className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
          >
            Browse Courses
          </Link>
        </div>

      </div>
    </div>
  );
}
