import { useDispatch } from "react-redux";
import { activeConversation } from "../../slices/activeConvslice";

const ConversationItems = ({ profile, myid }) => {
  const dispatch = useDispatch();
  const isCreator = profile?.creator?._id === myid;
  const contact = isCreator ? profile?.participent : profile?.creator;

 console.log(contact)
  const activeconvhanlde = () => {
    dispatch(activeConversation({ ...contact, convId: profile._id }));
  };
  return (
    <div
      onClick={activeconvhanlde}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-3 transition hover:border-border bg-amber-900 hover:bg-muted"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-accent-soft font-bold  text-accent">
        {(contact?.fullname || "U").charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-text-primary">
          {contact?.fullname || "Unknown contact"}
        </h1>

        <p className="mt-1 truncate text-xs text-text-muted transition group-hover:text-text-secondary">
          {profile.lastmessage && profile.lastmessage !== "null"
            ? profile.lastmessage
            : "Start a conversation"}
        </p>
      </div>
    </div>
  );
};

export default ConversationItems;
