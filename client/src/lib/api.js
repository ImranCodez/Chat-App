import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const safeDeleteResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      deleteRouteUnavailable: true,
      message: "Delete service returned an invalid response",
    };
  }
};

const safeReactionResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      reactionRouteUnavailable: true,
      message: `Reaction request returned HTTP ${response.status}`,
      status: response.status,
    };
  }
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://chat-app-bmda.onrender.com",
  credentials: "include",
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const requestUrl = typeof args === "string" ? args : args.url;

  if (result.error?.status === 401 && requestUrl !== "/auth/refresh") {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (!refreshResult.error) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithRefresh,

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
    reactToMessage: build.mutation({
      async queryFn({ messageId, emoji }, api, extraOptions, baseQuery) {
        const result = await baseQuery(
          {
            url: `/conv/message/${encodeURIComponent(messageId)}/react`,
            method: "POST",
            body: { emoji },
            responseHandler: safeReactionResponse,
          },
          api,
          extraOptions,
        );

        if (!result.error && !result.data?.reactionRouteUnavailable) {
          return result;
        }

        if (result.error && !result.error.data?.reactionRouteUnavailable) {
          return result;
        }

        const fallbackResult = await baseQuery(
          {
            url: `/conv/message/${encodeURIComponent(messageId)}/reaction`,
            method: "POST",
            body: { emoji },
            responseHandler: safeReactionResponse,
          },
          api,
          extraOptions,
        );

        if (fallbackResult.data?.reactionRouteUnavailable) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: fallbackResult.data.message,
            },
          };
        }

        return fallbackResult;
      },
    }),
    deleteMessage: build.mutation({
      async queryFn({ messageId, mode }, api, extraOptions, baseQuery) {
        const request = {
          url: `/conv/message/${messageId}/delete?mode=${mode}`,
          method: "POST",
          body: { mode },
          responseHandler: safeDeleteResponse,
        };
        const result = await baseQuery(request, api, extraOptions);

        if (!result.error && !result.data?.deleteRouteUnavailable)
          return result;

        const fallbackResult = await baseQuery(
          {
            url: `/conv/message/${messageId}?mode=${mode}`,
            method: "DELETE",
            body: { mode },
            responseHandler: safeDeleteResponse,
          },
          api,
          extraOptions,
        );

        if (fallbackResult.data?.deleteRouteUnavailable) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Delete service returned an invalid response",
            },
          };
        }

        return fallbackResult;
      },
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
  useReactToMessageMutation,
  useAddFriendMutation,
  useSendMessageMutation,
  useDeleteMessageMutation,
} = apiSlice;
