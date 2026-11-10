
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function MyLearning() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificateLoading, setCertificateLoading] = useState("");

  useEffect(() => {
    const loadMyLearning = async () => {
      try {
        setLoading(true);
        setError("");

        const userResponse = await fetch("/api/auth/me.php", {
          credentials: "include",
        });

        const userData = await userResponse.json();

        if (!userResponse.ok || !userData.success) {
          navigate("/login", { replace: true });
          return;
        }

        setUser(userData.user);

        const courseResponse = await fetch(
          "/api/courses/my-courses.php",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const courseData = await courseResponse.json();

        if (!courseResponse.ok || !courseData.success) {
          throw new Error(
            courseData.message || "Unable to load your courses."
          );
        }

        const enrolledCourses = Array.isArray(courseData.courses)
          ? courseData.courses
          : [];

        const coursesWithProgress = await Promise.all(
          enrolledCourses.map(async (course) => {
            try {
              const response = await fetch(
                `/api/courses/progress.php?slug=${encodeURIComponent(course.slug)}`,
                {
                  credentials: "include",
                  cache: "no-store",
                }
              );

              const data = await response.json();

              if (!response.ok || !data.success) {
                return {
                  ...course,
                  completedCount: 0,
                  totalLessons: 0,
                  progress: 0,
                };
              }

              const completedIds = (data.completed_lessons || []).map(Number);

              const lessonsResponse = await fetch(
                `/api/courses/lessons.php?slug=${encodeURIComponent(course.slug)}`,
                {
                  credentials: "include",
                  cache: "no-store",
                }
              );

              const lessonsData = await lessonsResponse.json();

              if (!lessonsResponse.ok || !lessonsData.success) {
                return {
                  ...course,
                  completedCount: 0,
                  totalLessons: 0,
                  progress: 0,
                };
              }

              const lessons = lessonsData.lessons || [];
              const totalLessons = lessons.length;

              const completedCount = lessons.filter((lesson) =>
                completedIds.includes(Number(lesson.id))
              ).length;

              const progress = totalLessons
                ? Math.round((completedCount / totalLessons) * 100)
                : 0;

              return {
                ...course,
                completedCount,
                totalLessons,
                progress,
              };
            } catch (err) {
              console.error("Progress loading failed:", err);

              return {
                ...course,
                completedCount: 0,
                totalLessons: 0,
                progress: 0,
              };
            }
          })
        );

        setCourses(coursesWithProgress);
      } catch (err) {
        setError(
          err.message || "Unable to connect to server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyLearning();
  }, [navigate]);

  const completedCourses = courses.filter(
    (course) => course.totalLessons > 0 && course.progress === 100
  ).length;

  // Download certificate PDF
  const downloadCertificate = async (course) => {
    try {
      setCertificateLoading(course.slug);

      const response = await fetch(
        `/api/courses/certificate.php?slug=${encodeURIComponent(course.slug)}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Unable to generate certificate.");
        return;
      }

      const certificate = data.certificate;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Background
      pdf.setFillColor(248, 245, 255);
      pdf.rect(0, 0, 297, 210, "F");

      // Outer border
      pdf.setDrawColor(110, 55, 180);
      pdf.setLineWidth(2);
      pdf.rect(8, 8, 281, 194);

      // Inner border
      pdf.setDrawColor(190, 155, 225);
      pdf.setLineWidth(0.7);
      pdf.rect(13, 13, 271, 184);

      // Academy name
      pdf.setTextColor(100, 45, 160);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(25);
      pdf.text("NGAnimationCR Academy", 148.5, 38, {
        align: "center",
      });

      // Certificate heading
      pdf.setTextColor(35, 35, 55);
      pdf.setFontSize(30);
      pdf.text("CERTIFICATE", 148.5, 68, {
        align: "center",
      });

      pdf.setFontSize(16);
      pdf.setTextColor(110, 90, 130);
      pdf.text("OF COMPLETION", 148.5, 79, {
        align: "center",
      });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(70, 70, 85);
      pdf.text("This certificate is proudly presented to", 148.5, 101, {
        align: "center",
      });

      // Student name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(26);
      pdf.setTextColor(90, 45, 150);
      pdf.text(certificate.student_name, 148.5, 119, {
        align: "center",
        maxWidth: 240,
      });

      // Course details
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(65, 65, 80);
      pdf.text("For successfully completing the course", 148.5, 136, {
        align: "center",
      });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(19);
      pdf.setTextColor(45, 45, 65);
      pdf.text(certificate.course_name, 148.5, 150, {
        align: "center",
        maxWidth: 240,
      });

      // Certificate number and date
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(85, 85, 100);

      pdf.text(
        `Certificate ID: ${certificate.certificate_number}`,
        20,
        183
      );

      const issuedDate = new Date(
        certificate.issued_at.replace(" ", "T")
      ).toLocaleDateString("en-IN");

      pdf.text(`Issue Date: ${issuedDate}`, 277, 183, {
        align: "right",
      });

      // Signature
      pdf.setDrawColor(100, 45, 160);
      pdf.line(115, 173, 182, 173);

      pdf.setFontSize(10);
      pdf.text("Authorized Signature", 148.5, 179, {
        align: "center",
      });

      pdf.save(
        `NGAnimationCR-Certificate-${course.slug}.pdf`
      );
    } catch (err) {
      console.error(err);
      alert("Certificate download failed. Please try again.");
    } finally {
      setCertificateLoading("");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout.php", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Logout failed.");
        return;
      }

      navigate("/login", { replace: true });
    } catch {
      setError("Unable to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p>Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 px-5 text-white">
        <p className="text-center text-red-300">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
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
            <h1 className="mt-3 text-4xl font-bold">My Learning</h1>
            <p className="mt-3 text-slate-400">
              Welcome back, {user.name}!
            </p>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>

         <div className="flex items-center gap-3">
  <Link
    to="/profile"
    className="rounded-lg border border-purple-500 px-5 py-3 font-semibold text-purple-300 transition hover:bg-purple-600 hover:text-white"
  >
    👤 My Profile
  </Link>

  <button
    onClick={handleLogout}
    className="rounded-lg border border-red-500/50 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
  >
    Logout
  </button>
</div>
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">My Courses</p>
            <h2 className="mt-3 text-3xl font-bold text-purple-400">
              {courses.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Completed Courses</p>
            <h2 className="mt-3 text-3xl font-bold text-green-400">
              {completedCourses}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Learning Status</p>
            <h2 className="mt-3 text-xl font-bold text-purple-400">
              {courses.length > 0
                ? completedCourses === courses.length
                  ? "All Courses Completed"
                  : "Learning Active"
                : "Ready to Start"}
            </h2>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">My Purchased Courses</h2>
            <p className="mt-2 text-sm text-slate-400">
              Access all your enrolled courses from here.
            </p>
          </div>

          <Link
            to="/courses"
            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-700"
          >
            Explore Courses
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const isCompleted =
                course.totalLessons > 0 && course.progress === 100;

              return (
                <div
                  key={course.id}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-purple-500/50"
                >
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-purple-700 to-slate-900 text-6xl">
                      🎓
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isCompleted
                            ? "bg-green-500/10 text-green-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {isCompleted ? "✓ Completed" : "Enrolled"}
                      </span>

                      {course.level && (
                        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                          {course.level}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold">{course.title}</h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                      {course.description || "Start learning this course today."}
                    </p>

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-400">Course Progress</span>
                        <span className="font-bold text-purple-400">
                          {course.progress}%
                        </span>
                      </div>

                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-purple-500 transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {course.completedCount} of {course.totalLessons} lessons completed
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                      <span>⏱ {course.duration || "Self-paced"}</span>
                      <span className="text-green-400">✓ Purchased</span>
                    </div>

                    <Link
                      to={`/learn/${course.slug}`}
                      className="mt-6 block rounded-lg bg-purple-600 px-5 py-3 text-center font-semibold transition hover:bg-purple-700"
                    >
                      {isCompleted
                        ? "Review Course →"
                        : course.progress > 0
                          ? "Continue Learning →"
                          : "Start Learning →"}
                    </Link>

                    {isCompleted && (
                      <button
                        onClick={() => downloadCertificate(course)}
                        disabled={certificateLoading === course.slug}
                        className="mt-3 w-full rounded-lg border border-green-500 px-5 py-3 font-semibold text-green-400 transition hover:bg-green-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {certificateLoading === course.slug
                          ? "Generating Certificate..."
                          : "🏆 Download Certificate"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="text-5xl">🎓</div>
            <h3 className="mt-5 text-xl font-bold">
              Your Learning Journey Starts Here
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              You haven't enrolled in any courses yet. Explore our courses and start learning.
            </p>
            <Link
              to="/courses"
              className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
