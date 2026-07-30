import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  riskData: null,
  isAssessing: false,
  error: null,
};

const riskSlice = createSlice({
  name: "risk",
  initialState,
  reducers: {
    setRiskData: (state, action) => {
      state.riskData = action.payload;
      state.isAssessing = false;
      state.error = null;
    },
    setIsAssessing: (state, action) => {
      state.isAssessing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isAssessing = false;
    },
    resetRisk: (state) => {
      state.riskData = null;
      state.isAssessing = false;
      state.error = null;
    },
  },
});

export const { setRiskData, setIsAssessing, setError, resetRisk } = riskSlice.actions;
export default riskSlice.reducer;