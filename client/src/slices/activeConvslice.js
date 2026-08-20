import { createSlice } from "@reduxjs/toolkit";

const ActiveconvenSlic = createSlice({
  name: "activeconv",
  initialState: {
    active: null,
  },
  reducers: {
    activeConversation: (state, action) => {
      console.log(action.payload);
      state.active =action.payload;
    },
  },
});
export default  ActiveconvenSlic.reducer
export const { activeConversation } = ActiveconvenSlic.actions;
