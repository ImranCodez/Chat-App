import React, { useState } from "react";
import { Link } from "react-router-dom";
import ConversationItems from "./ui/ConversationItems";
import { toast } from "react-toastify";
import { useAddFriendMutation, useGetConversationQuery } from "../lib/api";
import { FiMessageCircle, FiPlus, FiX, FiLogOut } from "react-icons/fi";

const SideNavbar = ({ Userprofile }) => {
  const { data, isFetching } = useGetConversationQuery();
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  // Frien email object
  const [frdemail, setEmail] = useState({
    email: "",
  });
  console.log(data)
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
    const res = await addFriend(frdemail).unwrap()
      

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
    <aside className="flex h-screen w-full max-w-[280px] shrink-0 flex-col border-r border-border bg-surface px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold tracking-tight text-coil"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20">
            <FiMessageCircle size={18} />
          </span>
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
      <div className="mt-8 flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          <span>Messages</span>

          <span>{data?.data?.length || 0}</span>
        </div>

        <div className="min-h-0 space-y-1 overflow-y-auto pr-1">
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
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-text-muted transition hover:bg-muted hover:text-error"
        >
          <FiLogOut size={15} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default SideNavbar;
