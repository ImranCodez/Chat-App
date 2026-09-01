
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} from "../lib/api";
import { toast } from "react-toastify";

import {
  FiMessageCircle,
  FiMoreVertical,
  FiPaperclip,
  FiSend,
} from "react-icons/fi";

import { initsocket } from "../lib/socketApi";

const Home = () => {
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Typing timeout
  const typingTimeoutRef = useRef(null);

  // Chat container reference
  const chatDisplayRef = useRef(null);

  // --------------------------------
  // Active conversation
  // --------------------------------

  const perticipentdata = useSelector(
    (state) => state.activeconv.active
  );

  const currentUserId = perticipentdata?._id;

  // --------------------------------
  // Get messages
  // --------------------------------

  const [
    triggermessage,
    { data = [], isLoading, error },
  ] = useLazyGetMessagesQuery();

  // --------------------------------
  // Send message
  // --------------------------------

  const [sendMessage, { isLoading: isSending }] =
    useSendMessageMutation();

  // --------------------------------
  // Socket connection
  // --------------------------------

  useEffect(() => {
    initsocket();
  }, []);

  // --------------------------------
  // Get messages when conversation changes
  // --------------------------------

  useEffect(() => {
    if (perticipentdata?.convId) {
      triggermessage(perticipentdata.convId);
    }
  }, [perticipentdata, triggermessage]);

  // --------------------------------
  // AUTO SCROLL TO BOTTOM
  // --------------------------------

  useEffect(() => {
    if (!chatDisplayRef.current) return;

    chatDisplayRef.current.scrollTop =
      chatDisplayRef.current.scrollHeight;
  }, [data?.data, isTyping]);

  // --------------------------------
  // Typing socket listener
  // --------------------------------

  useEffect(() => {
    const socket = initsocket();

    if (!perticipentdata?.convId) return;

    const handleTyping = ({ conversationId }) => {
      if (
        String(conversationId) ===
        String(perticipentdata.convId)
      ) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ conversationId }) => {
      if (
        String(conversationId) ===
        String(perticipentdata.convId)
      ) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [perticipentdata?.convId]);

  // --------------------------------
  // Typing status
  // --------------------------------

  const handleTypingStatus = (value) => {
    const socket = initsocket();

    if (!perticipentdata?.convId) return;

    const conversationId = perticipentdata.convId;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // --------------------------------
    // Input empty
    // --------------------------------

    if (!value.trim()) {
      socket.emit("stop_typing", {
        conversationId,
      });

      setIsTyping(false);

      return;
    }

    // --------------------------------
    // User is typing
    // --------------------------------

    socket.emit("typing", {
      conversationId,
    });

    // --------------------------------
    // Automatically stop typing
    // after 1.2 seconds
    // --------------------------------

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        conversationId,
      });

      setIsTyping(false);
    }, 1200);
  };

  // --------------------------------
  // Cleanup typing timeout
  // --------------------------------

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // --------------------------------
  // Send message
  // --------------------------------

  const submitMessage = async (event) => {
    event.preventDefault();

    const content = messageText.trim();

    if (
      !content ||
      !perticipentdata?.convId ||
      isSending
    ) {
      return;
    }

    const conversationId = perticipentdata.convId;

    // --------------------------------
    // Stop typing immediately
    // --------------------------------

    const socket = initsocket();

    socket.emit("stop_typing", {
      conversationId,
    });

    setIsTyping(false);

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // --------------------------------
    // Send message
    // --------------------------------

    try {
      const response = await sendMessage({
        content,
        conversation: conversationId,
      }).unwrap();

      // Clear input
      setMessageText("");

      // --------------------------------
      // Update conversation list
      // --------------------------------

      if (
        response?.data?.conversation ||
        conversationId
      ) {
        const conversationIdFromResponse =
          response?.data?.conversation ||
          conversationId;

        import("../store").then(({ store }) => {
          import("../lib/api").then(({ apiSlice }) => {
            store.dispatch(
              apiSlice.util.updateQueryData(
                "getConversation",
                undefined,
                (cache) => {
                  if (
                    !cache?.data ||
                    !Array.isArray(cache.data)
                  ) {
                    return;
                  }

                  const targetIndex =
                    cache.data.findIndex(
                      (item) =>
                        String(item._id) ===
                        String(
                          conversationIdFromResponse
                        )
                    );

                  if (targetIndex === -1) return;

                  cache.data[targetIndex] = {
                    ...cache.data[targetIndex],
                    lastmessage: content,
                    updatedAt:
                      new Date().toISOString(),
                  };

                  // Latest conversation first
                  cache.data.sort(
                    (a, b) =>
                      new Date(
                        b.updatedAt || 0
                      ).getTime() -
                      new Date(
                        a.updatedAt || 0
                      ).getTime()
                  );
                }
              )
            );
          });
        });
      }
    } catch (sendError) {
      toast.error(
        sendError?.data?.message ||
          "Message could not be sent"
      );
    }
  };

  // --------------------------------
  // No active conversation
  // --------------------------------

  if (!perticipentdata) {
    return (
      <div className="ambient-canvas relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6">
        <div className="ambient-grid pointer-events-none absolute inset-0" />

        <div className="pointer-events-none absolute left-[12%] top-[18%] h-3 w-3 rounded-full bg-accent/60 float-slow" />

        <div className="pointer-events-none absolute bottom-[22%] right-[16%] h-2 w-2 rounded-full bg-brand-light/70 float-delayed" />

        <svg
          className="pointer-events-none absolute h-[min(78vw,34rem)] w-[min(78vw,34rem)] text-accent/25"
          viewBox="0 0 540 540"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="welcome-orbit"
            cx="270"
            cy="270"
            r="198"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 14"
          />

          <circle
            className="welcome-orbit-reverse"
            cx="270"
            cy="270"
            r="148"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="1 10"
          />

          <path
            className="welcome-dash"
            d="M74 332C150 198 216 392 302 246S428 140 482 204"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          <circle
            className="welcome-pulse"
            cx="270"
            cy="270"
            r="62"
            fill="rgb(16 38 56 / 0.72)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        <div className="form-enter relative flex max-w-sm flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/30 bg-accent-soft text-accent shadow-xl shadow-brand/10 hover:border-white duration-300">
            <FiMessageCircle size={30} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Your conversations, in one place
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Select a conversation from the sidebar to pick
            up where you left off.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Chat UI
  // --------------------------------

  return (
    <section className="ambient-canvas relative flex h-screen w-full flex-col overflow-hidden bg-bg">
      <div className="ambient-grid pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute right-[12%] top-24 h-32 w-32 rounded-full border border-accent/10 float-slow" />

      <div className="pointer-events-none absolute bottom-32 left-[18%] h-16 w-16 rounded-xl border border-brand/15 bg-brand/5 float-delayed" />

      {/* --------------------------------
          Header
      -------------------------------- */}

      <div className="chat-enter relative flex shrink-0 items-center justify-between border-b border-border bg-surface/95 px-6 py-4 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-lg font-bold text-accent">
            {perticipentdata.fullname
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-text-primary">
              {perticipentdata.fullname}
            </h2>

            <p className="text-xs text-online">
              {isTyping ? "Typing..." : "Online now"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-muted hover:text-text-primary"
          aria-label="Conversation options"
        >
          <FiMoreVertical size={18} />
        </button>
      </div>

      {/* --------------------------------
          Messages
      -------------------------------- */}

      <div
        ref={chatDisplayRef}
        className="relative flex min-h-0 flex-1 flex-col space-y-3 overflow-y-auto px-6 py-6 sm:px-10"
        id="chatDisplay"
      >
        {isLoading && (
          <p className="m-auto text-sm text-text-muted">
            Loading messages...
          </p>
        )}

        {error && (
          <p className="m-auto text-sm text-error">
            Could not load messages.
          </p>
        )}

        {!isLoading &&
          !error &&
          !data?.data?.length && (
            <p className="m-auto text-sm text-text-muted">
              No messages yet. Say hello.
            </p>
          )}

        {/* --------------------------------
            Existing Messages
        -------------------------------- */}

        {!isLoading &&
          !error &&
          data?.data?.map((items) => {
            const senderId =
              items?.sender?._id || items?.sender;

            const isOwnMessage =
              String(senderId) ===
              String(currentUserId);

            return isOwnMessage ? (
              <div
                key={items._id || items.content}
                className="message-enter chat-message max-w-[min(75%,28rem)] self-start rounded-2xl rounded-bl-md border border-border bg-chat-received px-4 py-2.5 text-sm leading-6 text-text-primary [animation-delay:120ms]"
              >
                {items.content}
              </div>
            ) : (
              <div
                key={items._id || items.content}
                className="message-enter chat-message max-w-[min(75%,28rem)] self-end rounded-2xl rounded-br-md bg-chat-sent px-4 py-2.5 text-sm leading-6 text-white shadow-lg shadow-chat-sent/10"
              >
                {items.content}
              </div>
            );
          })}

        {/* --------------------------------
            Typing Indicator
        -------------------------------- */}

        {isTyping && (
          <div
            className="message-enter flex max-w-[min(75%,28rem)] self-start items-center rounded-2xl rounded-bl-md border border-border bg-chat-received px-4 py-3"
            aria-live="polite"
          >
            <span
              className="typing-indicator"
              aria-label="Typing indicator"
            >
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </span>
          </div>
        )}
      </div>

      {/* --------------------------------
          Input
      -------------------------------- */}

      <form
        onSubmit={submitMessage}
        className="relative shrink-0 border-t border-border bg-surface/95 px-4 py-4 backdrop-blur-sm sm:px-6"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted p-1.5 focus-within:border-brand/70">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-hover hover:text-accent"
            aria-label="Attach a file"
          >
            <FiPaperclip size={18} />
          </button>

          <input
            value={messageText}
            onChange={(event) => {
              const nextValue = event.target.value;

              setMessageText(nextValue);

              handleTypingStatus(nextValue);
            }}
            placeholder="Type your message..."
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-text-primary outline-none placeholder:text-text-muted"
            id="chatInput"
            type="text"
          />

          <button
            type="submit"
            disabled={
              isSending ||
              !messageText.trim()
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50"
            id="sendButton"
            aria-label="Send message"
          >
            <FiSend size={17} />
          </button>
        </div>
      </form>
    </section>
  );
};

export default Home;
