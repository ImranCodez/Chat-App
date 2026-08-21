import { useDispatch } from "react-redux";
import { activeConversation } from "../../slices/activeConvslice";

const ConversationItems = ({ profile, myid }) => {
  const dispatch = useDispatch();

  const activeconvhanlde = () => {
    if (profile?._id == myid) {
      dispatch(
        activeConversation({ ...profile.participent, convId: profile._id }),
      );
    } else {
      dispatch(activeConversation({ ...profile.creator, convId: profile._id }));
    }
  };
  return (
    <div
      onClick={activeconvhanlde}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-3 transition hover:border-border hover:bg-muted"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-accent-soft font-bold text-accent">
        {(
          (profile?._id == myid
            ? profile?.creator?.fullname
            : profile?.participent?.fullname) || "U"
        )
          .charAt(0)
          .toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-text-primary">
          {profile?._id == myid
            ? profile?.creator?.fullname
            : profile?.participent?.fullname}
        </h1>

        <p className="mt-1 truncate text-xs text-text-muted transition group-hover:text-text-secondary">
          {profile.lastMessage || "Hi everyone"}
        </p>
      </div>
    </div>
  );
};

export default ConversationItems;
