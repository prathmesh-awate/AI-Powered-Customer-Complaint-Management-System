import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./slices/formSlice";
import aiReducer from "./slices/aiSlice";
import riskReducer from "./slices/riskSlice";

const store = configureStore({
  reducer: {
    form: formReducer,
    ai: aiReducer,
    risk: riskReducer,
  },
});

export default store;