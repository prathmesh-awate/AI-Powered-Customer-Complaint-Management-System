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
  suggestedSeverity: "",
  suggestedNextAction: "",
  initialRiskAssessment: "",
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
      const data = action.payload;
      return {
        ...state,
        complaintSource:      data.complaintSource      || state.complaintSource,
        customerName:         data.customerName         || state.customerName,
        productName:          data.productName          || state.productName,
        productStrength:      data.productStrength      || state.productStrength,
        batchLotNumber:       data.batchLotNumber       || state.batchLotNumber,
        manufacturingDate:    data.manufacturingDate    || state.manufacturingDate,
        expiryDate:           data.expiryDate           || state.expiryDate,
        quantityAffected:     data.quantityAffected     || state.quantityAffected,
        complaintType:        data.complaintType        || state.complaintType,
        complaintDate:        data.complaintDate        || state.complaintDate,
        complaintDescription: data.complaintDescription || state.complaintDescription,
        initialSeverity:      data.initialSeverity      || state.initialSeverity,
        priority:             data.priority             || state.priority,
        suggestedSeverity:    data.suggestedSeverity    || state.suggestedSeverity,
        suggestedNextAction:  data.suggestedNextAction  || state.suggestedNextAction,
        initialRiskAssessment: data.initialRiskAssessment || state.initialRiskAssessment,
      };
    },
  },
});

export const { updateField, resetForm, populateForm } = formSlice.actions;
export default formSlice.reducer;