import React from "react";
import { Link } from "react-router-dom";
import ConversationItems from "./ui/ConversationItems";
import { useGetConversationQuery } from "../lib/api";
import { FiMessageCircle, FiPlus, FiLogOut } from "react-icons/fi";
const SideNavbar = ({ profile }) => {
  const { data, isFetching } = useGetConversationQuery();
  
  return (
    <aside className="flex h-screen w-full max-w-[280px] shrink-0 flex-col border-r border-border bg-surface px-4 py-5">
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
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:border-border-hover hover:bg-muted hover:text-accent"
          aria-label="New conversation"
        >
          <FiPlus size={18} />
        </button>
      </div>

      <div className="mt-8 flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          <span>Messages</span>
          <span>{data?.data?.length || 0}</span>
        </div>
        <div className="min-h-0 space-y-1 overflow-y-auto pr-1">
          {isFetching && (
            <p className="px-2 py-4 text-sm text-text-muted">
              Loading chats...
            </p>
          )}
          {data?.data?.map((items) => (
            <ConversationItems
              key={items._id}
              profile={items}
              myid={profile._id}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-bold text-accent">
            {profile?.data?.fullname?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {profile?.data?.fullname}
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
