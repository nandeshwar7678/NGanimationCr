
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/auth/profile.php", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          navigate("/login", { replace: true });
          return;
        }

        setUser(data.user);
        setName(data.user.name);
      } catch {
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG and WEBP photos are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5 MB.");
      return;
    }

    setError("");
    setMessage("");
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    if (!photo) return;

    try {
      setUploading(true);
      setMessage("");
      setError("");

      const formData = new FormData();
      formData.append("photo", photo);

      const response = await fetch("/api/auth/upload-photo.php", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Photo upload failed.");
      }

      setUser((prev) => ({
        ...prev,
        profile_photo: data.profile_photo,
      }));

      setPhoto(null);
      setPreview("");
      setMessage("Profile photo updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/auth/profile.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Profile update failed.");
      }

      setUser(data.user);
      setName(data.user.name);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch("/api/auth/change-password.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Password change failed.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage("Password changed successfully!");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  const displayedPhoto = preview || user.profile_photo;

  const photoUrl = displayedPhoto
    ? displayedPhoto.startsWith("http")
      ? displayedPhoto
      : `https://aicloudetools.com${displayedPhoto}`
    : "";

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-xl">

        <Link
          to="/my-learning"
          className="text-purple-400 hover:text-purple-300"
        >
          ← Back to My Learning
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          {/* PROFILE PHOTO */}

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-purple-500 bg-purple-700 text-4xl font-bold">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold">
              My Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your account information
            </p>

            <div className="mt-5">
              <label className="inline-block cursor-pointer rounded-lg border border-purple-500 px-5 py-2 font-semibold text-purple-300 hover:bg-purple-600 hover:text-white">
                Choose Profile Photo

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>

              {photo && (
                <div className="mt-4">
                  <p className="mb-3 text-sm text-slate-400">
                    {photo.name}
                  </p>

                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                    className="rounded-lg bg-purple-600 px-5 py-2 font-semibold hover:bg-purple-700 disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </button>
                </div>
              )}

              <p className="mt-3 text-xs text-slate-500">
                JPG, PNG or WEBP · Maximum 5 MB
              </p>
            </div>
          </div>

          {message && (
            <div className="mb-5 rounded-lg bg-green-500/10 p-3 text-green-400">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg bg-red-500/10 p-3 text-red-400">
              {error}
            </div>
          )}

          {/* BASIC PROFILE FORM */}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email Address
              </label>

              <input
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Account Type
              </label>

              <input
                type="text"
                value={user.role}
                disabled
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 capitalize text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-full rounded-lg bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </form>

          {/* CHANGE PASSWORD */}

          <div className="my-8 border-t border-slate-700"></div>

          <h2 className="mb-2 text-2xl font-bold">
            Change Password
          </h2>

          <p className="mb-6 text-sm text-slate-400">
            Update your account password securely.
          </p>

          {passwordMessage && (
            <div className="mb-5 rounded-lg bg-green-500/10 p-3 text-green-400">
              {passwordMessage}
            </div>
          )}

          {passwordError && (
            <div className="mb-5 rounded-lg bg-red-500/10 p-3 text-red-400">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-500"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-500"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-500"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={
                changingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="w-full rounded-lg border border-purple-500 bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-700 disabled:opacity-50"
            >
              {changingPassword ? "Updating Password..." : "Change Password"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
