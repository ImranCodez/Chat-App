import { createSlice } from "@reduxjs/toolkit";

const ActiveconvenSlic = createSlice({
  name: "activeconv",
  initialState: {
    active: null,
  },
  reducers: {
    activeConversation: (state, action) => {
      state.active =action.payload;
      console.log(action.payload);
    },
  },
});
export default  ActiveconvenSlic.reducer
export const { activeConversation } = ActiveconvenSlic.actions;
