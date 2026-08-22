import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
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
    }),
    addFriend: build.mutation({
      query: (email) => ({
        url: "/conv/addfriend",
        method: "POST",
        body:email ,
      }),
      invalidatesTags: ["Conversations"],
    }),
    sendMessage: build.mutation({
      query: (message) => ({
        url: "/conv/sendmessage",
        method: "POST",
        body: message,
      }),
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
