import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://chat-app-bmda.onrender.com",
    credentials: "include",
  }),

  endpoints: (build) => ({
    loggin: build.mutation({
      query: (logindata) => ({
        url: "/auth/signin",
        method: "POST",
        body: logindata,
      }),
    }),
    signup: build.mutation({
      query: (signupdata) => ({
        url: "/auth/signup",
        method: "POST",
        body: signupdata,
      }),
    }),
    getprofile: build.query({
      query: () => "/auth/profile",
    }),
    getConversation: build.query({
      query: () => "/conv/list",
      providesTags: ["Conversations"],
    }),
    addFriend: build.mutation({
      query: (email) => ({
        url: "/conv/addfriend",
        method: "POST",
        body: email,
      }),
      invalidatesTags: ["Conversations"],
    }),
    sendMessage: build.mutation({
      query: (message) => ({
        url: "/conv/sendmessage",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Conversations"],
    }),
    getMessages: build.query({
      query: (convId) => `/conv/messageslist/${convId}`,
    }),
  }),
  tagTypes: ["Conversations"],
});

export const {
  useGetConversationQuery,
  useLogginMutation,
  useSignupMutation,
  useGetprofileQuery,
  useLazyGetMessagesQuery,
  useAddFriendMutation,
  useSendMessageMutation,
} = apiSlice;
