import React, { useEffect } from "react";
import { FaComments } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLazyGetMessagesQuery } from "../lib/api";

const Home = () => {
  const perticipentdata = useSelector((state) => state.activeconv.active);
  console.log(perticipentdata?.convId);
  const [triggermessage, { data }] = useLazyGetMessagesQuery();
  useEffect(() => {
    if (perticipentdata?.convId) {
      triggermessage(perticipentdata?.convId);
    }
  }, [perticipentdata]);

  console.log();

  // const activeChat = false;
  if (!perticipentdata) {
    return (
      <div className="flex justify-center items-center w-full h-screen ml-[-20px] bg-gray-200">
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <FaComments className="text-6xl text-blue-500 mb-4" />

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to ChatApp 👋
          </h1>

          <p className="text-gray-700 mt-2 max-w-md">
            Select a conversation from the sidebar and start chatting with your
            friends.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div class=" w-full pl-4 pr-5 mx-auto -ml-5 bg-white dark:bg-zinc-800 shadow-md overflow-hidden">
      <div class="flex flex-col h-full">
        <div class="px-4 py-3 border-b dark:border-zinc-700">
          <div class="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="w-4 px-5 flex justify-center items-center bg-slate-600 text-white text-3xl rounded-full border border-white">
                i
              </div>
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                {perticipentdata.fullname}
              </h2>
            </div>
            <div class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Online
            </div>
          </div>
        </div>
        <div
          class="flex-1 p-14 overflow-y-auto flex flex-col space-y-2"
          id="chatDisplay"
        >
          {data?.message?.map((items) => (
          <div class="chat-message self-end bg-blue-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm">
           {items.content}
          </div>

          ))}
          <div class="chat-message self-start bg-zinc-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm">
            Hello! I need a Chatbot!
          </div>
        </div>
        <div class="px-3 py-2 mb-3 border-t dark:border-zinc-700">
          <div class="flex gap-2">
            <input
              placeholder="Type your message..."
              class="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white  dark:border-zinc-600 text-sm"
              id="chatInput"
              type="text"
            />
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
              id="sendButton"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
