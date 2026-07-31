import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  riskData: null,
  assignedDepartment: null,
  escalated: false,
  routingReason: null,
  similarComplaints: [],
  rootCauseHypothesis: null,
  investigationChecklist: [],
};

const riskSlice = createSlice({
  name: "risk",
  initialState,
  reducers: {
    setAgentResults: (state, action) => {
      const data = action.payload;
      state.riskData             = data.riskAssessment        || null;
      state.assignedDepartment   = data.assignedDepartment    || null;
      state.escalated            = data.escalated             || false;
      state.routingReason        = data.routingReason         || null;
      state.similarComplaints    = data.similarComplaints     || [];
      state.rootCauseHypothesis  = data.rootCauseHypothesis   || null;
      state.investigationChecklist = data.investigationChecklist || [];
    },
    resetRisk: () => initialState,
  },
});

export const { setAgentResults, resetRisk } = riskSlice.actions;
export default riskSlice.reducer;