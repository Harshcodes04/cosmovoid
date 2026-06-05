import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import Navbar from "../components/NavBar";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [bioEdit, setBioEdit] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [savingBio, setSavingBio] = useState(false);
  const [bioError, setBioError] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const handleSaveBio = async () => {
    setSavingBio(true);
    setBioError("");
    try {
      const { data } = await api.patch("/auth/profile", { bio });
      if (setUser) setUser(data.user);
      setBioEdit(false);
    } catch (err) {
      setBioError(err.response?.data?.message || "Failed to save. Try again.");
    } finally {
      setSavingBio(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await api.delete("/auth/account");
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete account. Try again.",
      );
      setDeleting(false);
    }
  };

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="relative min-h-screen overflow-x-hidden px-6 pb-24 pt-16 md:px-12 lg:px-20 xl:px-32">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12 space-y-10 shadow-[0_0_50px_rgba(34,211,238,0.03)]">
          {/* Header */}
          <h1 className="text-3xl font-light text-white pb-2">Your Profile</h1>

          {/* Details List */}
          <div className="space-y-6">
            <div className="flex flex-col border-b border-white/5 pb-4">
              <span className="text-sm text-zinc-500 mb-1">Username</span>
              <span className="text-lg text-white">{user.username}</span>
            </div>

            <div className="flex flex-col border-b border-white/5 pb-4">
              <span className="text-sm text-zinc-500 mb-1">Email</span>
              <span className="text-lg text-white">{user.email}</span>
            </div>

            <div className="flex flex-col border-b border-white/5 pb-4">
              <span className="text-sm text-zinc-500 mb-1">Member Since</span>
              <span className="text-lg text-white">{joinedDate}</span>
            </div>
          </div>

          {/* About Yourself */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">About Yourself</span>
              {!bioEdit && (
                <button
                  type="button"
                  onClick={() => setBioEdit(true)}
                  className="text-sm text-cyan-400 transition-colors duration-500 hover:text-cyan-300"
                >
                  Edit
                </button>
              )}
            </div>

            {bioEdit ? (
              <div className="space-y-3">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                  rows={4}
                  className="w-full resize-none border border-white/10 bg-white/[0.02] p-4 text-white outline-none focus:border-cyan-400/50"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">
                    {bio.length}/300
                  </span>
                  <div className="flex gap-4 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setBioEdit(false);
                        setBio(user.bio || "");
                        setBioError("");
                      }}
                      className="text-zinc-400 transition-colors duration-500 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBio}
                      disabled={savingBio}
                      className="text-cyan-400 transition-colors duration-500 hover:text-cyan-300"
                    >
                      {savingBio ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
                {bioError && <p className="text-xs text-red-400">{bioError}</p>}
              </div>
            ) : (
              <p className="text-lg font-light leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {user.bio || (
                  <span className="text-zinc-600 italic">
                    No biography added.
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-10 border-t border-white/5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors duration-500 hover:bg-white/10 hover:text-white"
            >
              Sign Out
            </button>

            {!showConfirm ? (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition-colors duration-500 hover:bg-red-500/20 hover:text-red-300"
              >
                Delete Account
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {deleteError && (
                  <span className="text-xs text-red-400">{deleteError}</span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirm(false);
                    setDeleteError("");
                  }}
                  className="text-sm text-zinc-400 transition-colors duration-500 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-500 hover:opacity-90 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
