import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./lib/api";
import  ActiveconvenSlic  from "./slices/activeConvslice";

export const store = configureStore({
  reducer: {
    activeconv:ActiveconvenSlic,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});