
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "/api/admin/lessons.php";

const emptyForm = {
  course_id: "",
  title: "",
  description: "",
  drive_file_id: "",
  position: 1,
};

export default function AdminLessons() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // API helper
  async function request(options = {}) {
    const res = await fetch(API, {
      credentials: "include",
      ...options,
    });

    const responseText = await res.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        "Invalid server response: " + responseText.slice(0, 150)
      );
    }

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // Load courses and lessons
  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const data = await request();

      setCourses(data.courses || []);
      setLessons(data.lessons || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filter lessons
  const filteredLessons =
    selectedCourse === "all"
      ? lessons
      : lessons.filter(
          (lesson) =>
            Number(lesson.course_id) === Number(selectedCourse)
        );

  // Open Add Form
  function openAddForm() {
    const courseId =
      selectedCourse !== "all"
        ? selectedCourse
        : courses[0]?.id || "";

    const courseLessons = lessons.filter(
      (lesson) => Number(lesson.course_id) === Number(courseId)
    );

    const nextPosition =
      courseLessons.length > 0
        ? Math.max(
            ...courseLessons.map((lesson) => Number(lesson.position) || 0)
          ) + 1
        : 1;

    setEditingId(null);

    setForm({
      ...emptyForm,
      course_id: courseId,
      position: nextPosition,
    });

    setShowForm(true);
    setError("");
    setMessage("");
  }

  // Open Edit Form
  function openEditForm(lesson) {
    setEditingId(lesson.id);

    setForm({
      course_id: lesson.course_id,
      title: lesson.title || "",
      description: lesson.description || "",
      drive_file_id: lesson.drive_file_id || "",
      position: lesson.position || 1,
    });

    setShowForm(true);
    setError("");
    setMessage("");
  }

  // Handle Inputs
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Add / Update Lesson
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.course_id) {
      setError("Please select a course.");
      return;
    }

    if (!form.title.trim()) {
      setError("Lesson title required hai.");
      return;
    }

    if (
      !Number.isInteger(Number(form.position)) ||
      Number(form.position) < 1
    ) {
      setError("Valid lesson position enter karo.");
      return;
    }

    if (!form.drive_file_id.trim()) {
      setError("Google Drive File ID required hai.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        course_id: Number(form.course_id),
        title: form.title.trim(),
        description: form.description.trim(),
        drive_file_id: form.drive_file_id.trim(),
        position: Number(form.position),
      };

      if (editingId) {
        payload.id = editingId;
      }

      await request({
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      setMessage(
        editingId
          ? "Lesson updated successfully!"
          : "Lesson added successfully!"
      );

      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Delete Lesson
  async function deleteLesson(lesson) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${lesson.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await request({
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lesson.id,
        }),
      });

      setMessage("Lesson deleted successfully!");

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/admin"
              className="text-blue-400 text-sm hover:underline"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mt-3">
              Lessons & Videos
            </h1>

            <p className="text-gray-400 mt-1">
              Manage course lessons and Google Drive videos.
            </p>
          </div>

          <button
            onClick={openAddForm}
            disabled={courses.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold"
          >
            + Add New Lesson
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500 text-green-300 p-3 rounded-lg mb-5">
            {message}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
          <div className="bg-[#151d32] p-5 rounded-xl">
            <p className="text-gray-400">Total Lessons</p>
            <h2 className="text-3xl font-bold mt-2">
              {lessons.length}
            </h2>
          </div>

          <div className="bg-[#151d32] p-5 rounded-xl">
            <p className="text-gray-400">Courses</p>
            <h2 className="text-3xl font-bold mt-2">
              {courses.length}
            </h2>
          </div>
        </div>

        {/* Course Filter */}
        <div className="bg-[#151d32] p-5 rounded-xl mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Filter Lessons by Course
          </label>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:max-w-md bg-[#0b1020] border border-white/10 rounded-lg p-3"
          >
            <option value="all">All Courses</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Lessons List */}
        {loading ? (
          <p className="text-gray-400 py-10 text-center">
            Loading lessons...
          </p>
        ) : filteredLessons.length === 0 ? (
          <div className="bg-[#151d32] rounded-xl p-10 text-center text-gray-400">
            No lessons found for this course.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-[#151d32] border border-white/5 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="flex-1 min-w-0">

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-purple-500/15 text-purple-300 text-xs px-3 py-1 rounded-full">
                      Lesson {lesson.position}
                    </span>

                    <span className="text-xs text-gray-500">
                      ID: {lesson.id}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mt-3">
                    {lesson.title}
                  </h3>

                  <p className="text-blue-400 text-sm mt-1">
                    {lesson.course_title}
                  </p>

                  <p className="text-gray-400 text-sm mt-2">
                    {lesson.description}
                  </p>

                  <div className="mt-3 bg-[#0b1020] border border-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Google Drive File ID
                    </p>

                    <p className="text-sm text-gray-300 break-all">
                      {lesson.drive_file_id || "Not added"}
                    </p>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditForm(lesson)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteLesson(lesson)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">

            <div className="bg-[#151d32] border border-white/10 rounded-2xl p-6 w-full max-w-2xl my-8">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingId ? "Edit Lesson" : "Add New Lesson"}
                </h2>

                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                  type="button"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Course */}
                <div>
                  <label className="block text-sm mb-2">
                    Select Course *
                  </label>

                  <select
                    name="course_id"
                    value={form.course_id}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3"
                  >
                    <option value="">Select Course</option>

                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm mb-2">
                    Lesson Title *
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3"
                    placeholder="Enter lesson title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3"
                    placeholder="Enter lesson description"
                  />
                </div>

                {/* Google Drive ID */}
                <div>
                  <label className="block text-sm mb-2">
                    Google Drive File ID *
                  </label>

                  <input
                    name="drive_file_id"
                    value={form.drive_file_id}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3"
                    placeholder="Paste Google Drive File ID"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Google Drive URL se sirf File ID paste karo, poora URL nahi.
                  </p>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm mb-2">
                    Lesson Position *
                  </label>

                  <input
                    name="position"
                    type="number"
                    min="1"
                    step="1"
                    value={form.position}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3 rounded-lg font-semibold"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Lesson"
                      : "Save Lesson"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
