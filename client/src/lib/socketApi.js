import io from "socket.io-client";
import { store } from "../store";
import { apiSlice } from "./api";

let socket;

const initsocket = () => {
  if (socket) return socket;

  socket = io("http://localhost:8000");

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("new_message", (message) => {
    console.log("📩 New message:", message);

    const conversationId = String(message?.conversation);

    if (!conversationId) return;

    store.dispatch(
      apiSlice.util.updateQueryData("getMessages",conversationId,
        (cache) => {
          if (!cache?.data) return;
       console.log(cache?.data)
          const alreadyExists = cache.data.some(
            (item) => String(item._id) === String(message._id)
          );

          if (!alreadyExists) {
            cache.data.push(message);
          }
        }
      )
    );
  });
// 1. Socket → নতুন message পেল
//           ↓
// 2. conversationId বের করল
//           ↓
// 3. getMessages-এর cache খুঁজল
//           ↓
// 4. message আগে আছে কিনা check করল
//           ↓
// 5. না থাকলে cache.data-তে push করল
//           ↓
// 6. RTK Query cache update → React UI update

  // .flow chart ..



      //                 SERVER
      //                 │
      //                 │ নতুন message পাঠায়
      //                 ▼
      //        "new_message" event
      //                 │
      //                 ▼
      //   socket.on("new_message", message)
      //                 │
      //                 │
      //                 ▼
      //   ┌──────────────────────────┐
      //   │ message থেকে conversation │
      //   │ ID বের করা হচ্ছে          │
      //   └──────────────────────────┘
      //                 │
      //                 ▼
      //  conversationId = message.conversation
      //                 │
      //                 ▼
      //        conversationId আছে?
      //            /          \
      //          NO            YES
      //          │              │
      //          ▼              ▼
      //         STOP      store.dispatch()
      //                         │
      //                         ▼
      //             updateQueryData()
      //                         │
      //                         ▼
      //               "getMessages"
      //                         │
      //                         ▼
      //               conversationId
      //                         │
      //                         ▼
      //            RTK Query Cache খুঁজে
      //                         │
      //                         ▼
      //                  cache পাওয়া?
      //                    /       \
      //                  NO         YES
      //                  │           │
      //                  ▼           ▼
      //                 STOP    cache.data
      //                              │
      //                              ▼
      //                    .some() দিয়ে check
      //                              │
      //                              ▼
      //              message আগে থেকেই আছে?
      //                    /              \
      //                  YES              NO
      //                   │                │
      //                   ▼                ▼
      //             কিছু করবে না     cache.data.push(message)
      //                                    │
      //                                    ▼
      //                             RTK Query Cache
      //                                 updated
      //                                    │
      //                                    ▼
      //                         useGetMessagesQuery()
      //                                    │
      //                                    ▼
      //                              React UI update
      //                                    │
      //                                    ▼
      //                         নতুন message দেখা যায়
  socket.on("connect_error", (error) => {
    console.log("❌ Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });

  return socket;
};

export { initsocket };