import { useEffect, useRef } from "react";
import { FiSmile } from "react-icons/fi";

const MessageBubble = ({
  message,
  isOwnMessage,
  isMenuOpen,
  isReactionOpen,
  selectedEmoji,
  onToggleMenu,
  onToggleReactions,
  onSelectEmoji,
  onDelete,
}) => {
  const holdTimer = useRef(null);
  const longPressRef = useRef(false);
  const isDeleted = message.isDeletedForEveryone || message.isDeletedForMe;

  const clearHoldTimer = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  useEffect(() => clearHoldTimer, []);

  const startLongPress = () => {
    if (isDeleted) return;
    clearHoldTimer();
    holdTimer.current = setTimeout(() => {
      longPressRef.current = true;
      onToggleReactions(null);
      onToggleMenu(message._id);
    }, 550);
  };

  const handleClick = () => {
    if (isDeleted) return;
    if (longPressRef.current) {
      longPressRef.current = false;
      return;
    }
    onToggleReactions(message._id);
    onToggleMenu(null);
  };

  return (
    <div
      onClick={handleClick}
      onPointerDown={startLongPress}
      onPointerUp={clearHoldTimer}
      onPointerMove={clearHoldTimer}
      onPointerCancel={clearHoldTimer}
      className={`message-enter group relative flex max-w-[min(75%,28rem)] cursor-pointer rounded-2xl px-4 py-2.5 text-sm leading-6 wrap-anywhere ${
        isOwnMessage
          ? "self-end rounded-br-md bg-chat-sent text-white shadow-lg shadow-chat-sent/10"
          : "self-start rounded-bl-md border border-border bg-chat-received text-text-primary"
      } ${isDeleted ? "cursor-default italic opacity-70" : ""}`}
    >
      {isDeleted ? "This message was deleted" : message.content}

      {!isDeleted && isReactionOpen && (
        <div
          className={`absolute bottom-full z-20 mb-2 flex gap-1 rounded-full border border-border bg-surface p-1 shadow-xl ${
            isOwnMessage ? "right-0" : "left-0"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          {["👍", "❤️", "😂", "😮", "😢"].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelectEmoji(message._id, emoji);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-base hover:bg-muted"
              aria-label={`React ${emoji}`}
            >
              {emoji}
            </button>
          ))}
          <FiSmile className="m-2 text-text-muted" size={15} />
        </div>
      )}

      {selectedEmoji && !isDeleted && (
        <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-border bg-surface px-1 text-sm align-middle shadow-sm">
          {selectedEmoji}
        </span>
      )}

      {!isDeleted && isMenuOpen && (
        <div
          className={`absolute top-0 z-20 mt-1 w-44 rounded-lg border border-border bg-surface p-1 text-xs shadow-xl ${
            isOwnMessage ? "right-full mr-3" : "left-full ml-3"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onDelete(message._id, "me")}
            className="block w-full rounded px-3 py-2 text-left text-text-secondary hover:bg-muted"
          >
            Delete for me
          </button>
          {isOwnMessage && (
            <button
              type="button"
              onClick={() => onDelete(message._id, "everyone")}
              className="block w-full rounded px-3 py-2 text-left text-error hover:bg-muted"
            >
              Delete for everyone
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
