
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, ChevronDown, BookOpen, LogOut } from "lucide-react";

const courseIcons = {
  "ai-video-creation": "🎬",
  "ai-animation-masterclass": "🎨",
  "instagram-reels-creation": "📱",
};

const courseCategories = {
  "ai-video-creation": "Artificial Intelligence",
  "ai-animation-masterclass": "Animation",
  "instagram-reels-creation": "Content Creation",
};

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef(null);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses/list.php");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load courses.");
        }

        setCourses(data.courses || []);
      } catch (err) {
        setError("Courses load nahi ho paaye. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Check logged-in user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch("/api/auth/me.php", {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkUser();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout.php", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Logout failed.");
      }

      setUser(null);
      setProfileOpen(false);
      navigate("/courses");
    } catch (err) {
      alert(err.message || "Logout nahi ho paya. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const getInitial = () => {
    return user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Account Header */}
      <div className="mx-auto flex max-w-7xl justify-end px-6 pt-6">
        {!authLoading && !user && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg border border-purple-500 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold transition hover:bg-purple-700"
            >
              Register
            </button>
          </div>
        )}

        {!authLoading && user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 p-1.5 pr-3 transition hover:border-purple-500"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-lg font-bold text-white">
                {getInitial()}
              </div>

              <span className="max-w-28 truncate text-sm font-medium text-slate-200">
                {user.name || "My Account"}
              </span>

              <ChevronDown
                size={16}
                className={`text-slate-400 transition ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                <div className="border-b border-slate-700 px-4 py-3">
                  <p className="truncate font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/my-learning");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-purple-600/20 hover:text-white"
                >
                  <BookOpen size={18} />
                  My Learning
                </button>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 border-t border-slate-700 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  <LogOut size={18} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="px-6 py-16 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[4px] text-purple-400">
          NGAnimationCR Academy
        </p>

        <h1 className="text-4xl font-bold md:text-6xl">
          Learn. Create. <span className="text-purple-400">Grow.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-slate-300">
          Learn practical skills with expert-designed recorded courses.
          Learn anytime, anywhere and build your creative future.
        </p>
      </section>

      {/* Courses Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Explore Our Courses</h2>
          <p className="mt-2 text-slate-400">
            Choose a course and start learning today.
          </p>
        </div>

        {loading && (
          <p className="py-10 text-center text-slate-300">
            Loading courses...
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
            <p className="text-red-300">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-purple-600 px-5 py-2 font-semibold hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <p className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-300">
            No courses are available right now. Please check back later.
          </p>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition duration-300 hover:-translate-y-2 hover:border-purple-500"
              >
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-7xl">
                      {courseIcons[course.slug] || "🎓"}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-sm font-medium text-purple-400">
                    {courseCategories[course.slug] || "Online Course"}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {course.title}
                  </h3>

                  <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">
                    {course.description}
                  </p>

                  <div className="mt-5 flex justify-between gap-3 text-sm text-slate-300">
                    <span>{course.level}</span>
                    <span>{course.duration}</span>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-700 pt-5">
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(course.price)}
                    </span>

                    <button
                      onClick={() => navigate(`/courses/${course.slug}`)}
                      className="rounded-lg bg-purple-600 px-4 py-2 font-semibold transition hover:bg-purple-700"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
