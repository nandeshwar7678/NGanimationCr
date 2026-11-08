
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "/api/admin/courses.php";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  level: "Beginner",
  duration: "",
  thumbnail_url: "",
  published: 1,
};

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // API request helper
  async function request(url, options = {}) {
    const res = await fetch(url, {
      credentials: "include",
      ...options,
    });

    const responseText = await res.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        "Server returned invalid response: " +
          responseText.slice(0, 150)
      );
    }

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // Load all courses
  async function loadCourses() {
    try {
      setLoading(true);
      setError("");

      const data = await request(API);

      setCourses(data.courses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  // Open add form
  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
    setError("");
    setMessage("");
  }

  // Open edit form
  function openEditForm(course) {
    setEditingId(course.id);

    setForm({
      title: course.title || "",
      description: course.description || "",
      price:
        course.price ??
        Number(course.price_paise || 0) / 100,
      level: course.level || "Beginner",
      duration: course.duration || "",
      thumbnail_url: course.thumbnail_url || "",
      published: Number(course.published),
    });

    setShowForm(true);
    setError("");
    setMessage("");
  }

  // Handle form inputs
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Add or update course
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Course title required hai.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setError("Valid course price enter karo.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      let payload = {
        title: form.title.trim(),
        description: form.description,
        level: form.level,
        duration: form.duration,
        thumbnail_url: form.thumbnail_url,
        published: Number(form.published),
      };

      // POST: Backend expects price in rupees
      if (!editingId) {
        payload.price = Number(form.price);
      }

      // PUT: Backend expects price_paise
      if (editingId) {
        payload.id = editingId;
        payload.price_paise = Math.round(
          Number(form.price) * 100
        );
      }

      await request(API, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const wasEditing = Boolean(editingId);

      setShowForm(false);
      setForm({ ...emptyForm });
      setEditingId(null);

      setMessage(
        wasEditing
          ? "Course updated successfully!"
          : "Course added successfully!"
      );

      await loadCourses();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Publish / Unpublish course
  async function togglePublish(course) {
    const nextStatus =
      Number(course.published) === 1 ? 0 : 1;

    try {
      setError("");
      setMessage("");

      await request(API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: course.id,
          title: course.title,
          description: course.description || "",
          price_paise: Number(course.price_paise),
          level: course.level || "Beginner",
          duration: course.duration || "",
          thumbnail_url: course.thumbnail_url || "",
          published: nextStatus,
        }),
      });

      setMessage(
        nextStatus
          ? "Course published!"
          : "Course unpublished!"
      );

      await loadCourses();
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete course
  async function deleteCourse(course) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await request(API, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: course.id,
        }),
      });

      setMessage(
        "Course deleted or unpublished successfully."
      );

      await loadCourses();
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
              Course Management
            </h1>

            <p className="text-gray-400 mt-1">
              Add, edit, publish and manage your courses.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold"
          >
            + Add New Course
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="bg-green-500/10 border border-green-500 text-green-300 p-3 rounded-lg mb-5">
            {message}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

          <div className="bg-[#151d32] p-5 rounded-xl">
            <p className="text-gray-400">Total Courses</p>
            <h2 className="text-3xl font-bold mt-2">
              {courses.length}
            </h2>
          </div>

          <div className="bg-[#151d32] p-5 rounded-xl">
            <p className="text-gray-400">Published</p>
            <h2 className="text-3xl font-bold mt-2">
              {
                courses.filter(
                  (c) => Number(c.published) === 1
                ).length
              }
            </h2>
          </div>

          <div className="bg-[#151d32] p-5 rounded-xl">
            <p className="text-gray-400">Unpublished</p>
            <h2 className="text-3xl font-bold mt-2">
              {
                courses.filter(
                  (c) => Number(c.published) !== 1
                ).length
              }
            </h2>
          </div>

        </div>

        {/* Course List */}
        {loading ? (
          <p className="text-gray-400 py-10 text-center">
            Loading courses...
          </p>
        ) : courses.length === 0 ? (
          <div className="bg-[#151d32] rounded-xl p-10 text-center text-gray-400">
            No courses found. Add your first course.
          </div>
        ) : (
          <div className="space-y-4">

            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-[#151d32] border border-white/5 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold">
                      {course.title}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        Number(course.published) === 1
                          ? "bg-green-500/15 text-green-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}
                    >
                      {Number(course.published) === 1
                        ? "Published"
                        : "Unpublished"}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mt-2">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-3">
                    <span>
                      ₹
                      {Number(
                        course.price ??
                          Number(course.price_paise || 0) / 100
                      ).toLocaleString("en-IN")}
                    </span>

                    <span>{course.level}</span>
                    <span>{course.duration}</span>
                    <span>ID: {course.id}</span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Slug: {course.slug}
                  </p>

                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={() => openEditForm(course)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => togglePublish(course)}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                  >
                    {Number(course.published) === 1
                      ? "Unpublish"
                      : "Publish"}
                  </button>

                  <button
                    onClick={() => deleteCourse(course)}
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
                  {editingId ? "Edit Course" : "Add New Course"}
                </h2>

                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                  type="button"
                >
                  ×
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* Title */}
                <div>
                  <label className="block text-sm mb-2">
                    Course Title *
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500"
                    placeholder="Enter course title"
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
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500"
                    placeholder="Course description"
                  />
                </div>

                {/* Price and Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm mb-2">
                      Price (₹) *
                    </label>

                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Level
                    </label>

                    <select
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                      className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>

                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm mb-2">
                    Duration
                  </label>

                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500"
                    placeholder="Example: 5 hours"
                  />
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm mb-2">
                    Thumbnail URL
                  </label>

                  <input
                    name="thumbnail_url"
                    value={form.thumbnail_url}
                    onChange={handleChange}
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm mb-2">
                    Visibility
                  </label>

                  <select
                    name="published"
                    value={form.published}
                    onChange={handleChange}
                    className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3"
                  >
                    <option value={1}>Published</option>
                    <option value={0}>Unpublished</option>
                  </select>
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
                      ? "Update Course"
                      : "Save Course"}
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
