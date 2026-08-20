import { useDispatch } from "react-redux";
import { activeConversation } from "../../slices/activeConvslice";

const ConversationItems = ({ profile, myid }) => {
  const dispatch = useDispatch();
console.log(profile);

  const activeconvhanlde = () => {
    if (profile?._id == myid) {
      dispatch(activeConversation({...profile.participent,convId:profile._id}));
    } else {
      dispatch(activeConversation({...profile.creator,convId:profile._id}));
    }
  };
  return (
    <div
      onClick={activeconvhanlde}
      className="group flex items-center gap-2 rounded-[7px] duration-200 hover:bg-gray-300"
    >
      <div className="border mb-5 mt-2 ml-2 w-10 h-10 border-slate-800 rounded-full flex items-center justify-center bg-slate-600 text-white">
        I
      </div>

      <div>
        <h1 className="text-[17px] font-semibold text-black">
          {profile?._id == myid
            ? profile?.creator?.fullname
            : profile?.participent?.fullname}
        </h1>

        <p className="text-white group-hover:text-black duration-200">
          {profile.lastMessage || "Hi everyone"}
        </p>
      </div>
    </div>
  );
};

export default ConversationItems;
