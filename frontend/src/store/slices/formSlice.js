import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  complaintSource: "",
  customerName: "",
  productName: "",
  productStrength: "",
  batchLotNumber: "",
  manufacturingDate: "",
  expiryDate: "",
  quantityAffected: "",
  complaintType: "",
  complaintDate: "",
  complaintDescription: "",
  initialSeverity: "",
  priority: "",
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
    populateForm: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateField, resetForm, populateForm } = formSlice.actions;
export default formSlice.reducer;