import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import {
  FaUserAstronaut, FaEnvelope, FaCalendarAlt,
  FaShieldAlt, FaTrash, FaSignOutAlt, FaPen, FaCheck,
} from "react-icons/fa";

import Navbar from "../components/NavBar";

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300">
      <Icon size={14} />
    </span>
    <div>
      <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-600">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  </div>
);

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
        day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  const handleSaveBio = async () => {
    setSavingBio(true);
    setBioError("");
    try {
      const { data } = await api.patch("/auth/profile", { bio });
      // update context so navbar / other components reflect new data
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
      setDeleteError(err.response?.data?.message || "Failed to delete account. Try again.");
      setDeleting(false);
    }
  };

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <>
      <header><Navbar /></header>
      <main className="relative min-h-screen overflow-x-hidden px-4 pb-20 pt-10 sm:px-6 md:px-10 lg:px-14 xl:px-20">
        {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/[0.06] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl space-y-6">

        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Account</p>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0c1228]/95 via-[#080c1e]/98 to-[#060810]/98 p-6 shadow-[0_32px_64px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            {/* avatar */}
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-[0_0_32px_rgba(34,211,238,0.3)]">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {user.username}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">{user.email}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1 text-[10px] uppercase tracking-widest text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.9)]" />
                Active explorer
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-600">About yourself</p>
            {!bioEdit && (
              <button
                type="button"
                onClick={() => setBioEdit(true)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <FaPen size={9} /> Edit
              </button>
            )}
          </div>

          {bioEdit ? (
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5 space-y-3">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                rows={4}
                placeholder="Tell us about yourself — what got you into space? Your favourite mission? Anything!"
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-300/40"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-zinc-600">{bio.length}/300</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setBioEdit(false); setBio(user.bio || ""); setBioError(""); }}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBio}
                    disabled={savingBio}
                    className="flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    <FaCheck size={11} />
                    {savingBio ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
              {bioError && <p className="text-xs text-red-400">{bioError}</p>}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 min-h-[80px]">
              {user.bio ? (
                <p className="text-sm leading-6 text-zinc-300">{user.bio}</p>
              ) : (
                <p className="text-sm text-zinc-600 italic">
                  Nothing here yet — click Edit to introduce yourself.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-600 px-1">Profile details</p>
          <ProfileField icon={FaUserAstronaut} label="Username"     value={user.username} />
          <ProfileField icon={FaEnvelope}     label="Email address" value={user.email} />
          <ProfileField icon={FaCalendarAlt}  label="Member since"  value={joinedDate} />
          <ProfileField icon={FaShieldAlt}    label="Account type"  value="Standard" />
        </div>

        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-600 px-1">Actions</p>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-left transition-colors hover:border-white/14 hover:bg-white/6"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400">
              <FaSignOutAlt size={14} />
            </span>
            <div>
              <p className="text-sm font-medium text-white">Sign out</p>
              <p className="text-xs text-zinc-600">Log out of your Cosmovoid session</p>
            </div>
          </button>

          {/* Delete account */}
          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="flex w-full items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-5 py-4 text-left transition-colors hover:border-red-500/30 hover:bg-red-500/10"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-400">
                <FaTrash size={13} />
              </span>
              <div>
                <p className="text-sm font-medium text-red-400">Delete account</p>
                <p className="text-xs text-zinc-600">Permanently remove your account and all data</p>
              </div>
            </button>
          ) : (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.08] p-5">
              <p className="text-sm font-semibold text-red-300">Are you absolutely sure?</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                This will permanently delete your account, all journal entries, and cannot be undone.
              </p>
              {deleteError && <p className="mt-3 text-xs text-red-400">{deleteError}</p>}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {deleting ? "Deleting…" : "Yes, delete everything"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowConfirm(false); setDeleteError(""); }}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
    </>
  );
}
