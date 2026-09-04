import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ConversationItems from "./ui/ConversationItems";
import { toast } from "react-toastify";
import {
  useAddFriendMutation,
  useGetConversationQuery,
  useLogoutMutation,
} from "../lib/api";
import { FiMessageCircle, FiPlus, FiX, FiLogOut } from "react-icons/fi";
import { initsocket } from "../lib/socketApi";

const SideNavbar = ({ Userprofile }) => {
  const navigate = useNavigate();
  const { data, isFetching } = useGetConversationQuery();
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  useEffect(() => {
    if (!data?.data) return;
    const socket = initsocket();
    data?.data?.forEach((conversation) => {
      socket.emit("join_room", conversation._id);
    });
  }, [data]);

  // Frien email object
  const [frdemail, setEmail] = useState({
    email: "",
  });

  const [inputerr, setEmaierro] = useState("");

  const [addFriend, { isLoading: isAdding }] = useAddFriendMutation();

  const submitFriend = async (event) => {
    event.preventDefault();

    try {
      // Previous error clear
      setEmaierro("");

      // Check empty email
      if (!frdemail.email.trim()) {
        return setEmaierro("Enter your friend's email");
      }
      const res = await addFriend(frdemail).unwrap();

      toast.success("Contact added");

      // Reset email object
      setEmail({
        email: "",
      });

      setIsAddingFriend(false);
    } catch (error) {
      toast.error(error?.data?.message || "Could not add contact");
    }
  };

  return (
    <aside className="flex h-screen max-lg:h-dvh w-full max-w-70 max-lg:max-w-none shrink-0 flex-col overflow-hidden border-r border-border bg-surface px-4 py-5 max-lg:px-2 max-lg:py-3">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-2">
        <Link
          to="/"
          className="flex items-center ga-2 text-xl font-bold tracking-tight text-coil"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20">
            <FiMessageCircle size={18} />
          </span>
          {/* <span className="text-blue-600 ml-1 mr-1 ">
            M<span className="text-red-600 font-bold">❤</span>I
          </span> */}
          ChatApp
        </Link>

        <button
          type="button"
          onClick={() => {
            setIsAddingFriend((current) => !current);

            // Clear error when opening/closing form
            setEmaierro("");
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:border-border-hover hover:bg-muted hover:text-accent"
          aria-label="New conversation"
        >
          {isAddingFriend ? <FiX size={18} /> : <FiPlus size={18} />}
        </button>
      </div>

      {/* Input error */}
      {inputerr && (
        <p className="ml-3 mt-2 text-[15px] font-normal text-red-700">
          {inputerr}
        </p>
      )}

      {/* Add Friend Form */}
      {isAddingFriend && (
        <form
          onSubmit={submitFriend}
          className="mt-4 rounded-xl border border-border bg-muted p-3"
        >
          <label
            className="mb-2 block text-xs font-semibold text-text-secondary"
            htmlFor="friend-email"
          >
            Add by email
          </label>

          <div className="flex gap-2">
            <input
              id="friend-email"
              value={frdemail.email}
              onChange={(event) => {
                // Update email property inside object
                setEmail((prev) => ({ ...prev, email: event.target.value })); // Remove error when user starts typing
                setEmaierro("");
              }}
              placeholder="Find your friend.."
              type="email"
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary outline-none focus:border-brand"
              autoFocus
            />

            <button
              type="submit"
              disabled={isAdding}
              className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {isAdding ? "..." : "Add"}
            </button>
          </div>
        </form>
      )}

      {/* Conversations */}
      <div className="mt-8 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="mb-3 flex shrink-0 items-center justify-between px-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          <span>Messages</span>

          <span>{data?.data?.length || 0}</span>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden pr-1">
          {isFetching && (
            <p className="px-2 py-4 text-sm text-text-muted">
              Loading chats....
            </p>
          )}

          {data?.data?.map((items) => (
            <ConversationItems
              key={items._id}
              profile={items}
              myid={Userprofile?.data?._id}
            />
          ))}
        </div>
      </div>

      {/* Current User */}
      <div className="mt-5 border-t border-border pt-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-bold  text-accent">
            {Userprofile?.data?.fullname?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {Userprofile?.data?.fullname}
            </p>

            <p className="text-xs text-online">Active now</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            className="flex-1 rounded-lg border border-border py-2 text-center text-xs font-semibold text-text-secondary transition hover:border-border-hover hover:bg-muted hover:text-text-primary"
            to="/login"
          >
            Login
          </Link>

          <Link
            className="flex-1 rounded-lg border border-border py-2 text-center text-xs font-semibold text-text-secondary transition hover:border-border-hover hover:bg-muted hover:text-text-primary"
            to="/signup"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-text-muted transition hover:bg-muted hover:text-error"
        >
          <FiLogOut size={15} />
          Log out
        </button>
      </div>

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5"
          role="presentation"
          onClick={() => {
            if (!isLoggingOut) setShowLogoutModal(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="logout-title"
              className="text-lg font-semibold text-text-primary"
            >
              Do you want to log out?
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              You can log in again whenever you want.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-muted disabled:opacity-50"
              >
                No
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={async () => {
                  try {
                    await logout().unwrap();
                    setShowLogoutModal(false);
                    navigate("/Login", { replace: true });
                  } catch (error) {
                    toast.error(error?.data?.message || "Could not log out");
                  }
                }}
                className="rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideNavbar;
