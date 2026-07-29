import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  extractionProgress: 10,
  isExtracting: true,
  chatMessage: "",
  chatHistory: [],
  showPasteModal: false,
  pasteText: "",
  isDragging: false,
  uploadedFileName: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setExtractionProgress: (state, action) => {
      state.extractionProgress = action.payload;
    },
    setIsExtracting: (state, action) => {
      state.isExtracting = action.payload;
    },
    setChatMessage: (state, action) => {
      state.chatMessage = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload);
      state.chatMessage = "";
    },
    setShowPasteModal: (state, action) => {
      state.showPasteModal = action.payload;
    },
    setPasteText: (state, action) => {
      state.pasteText = action.payload;
    },
    setIsDragging: (state, action) => {
      state.isDragging = action.payload;
    },
    setUploadedFileName: (state, action) => {
      state.uploadedFileName = action.payload;
    },
    resetAI: (state) => {
      state.extractionProgress = 0;
      state.isExtracting = false;
      state.chatHistory = [];
      state.uploadedFileName = null;
      state.pasteText = "";
    },
  },
});

export const {
  setExtractionProgress,
  setIsExtracting,
  setChatMessage,
  addChatMessage,
  setShowPasteModal,
  setPasteText,
  setIsDragging,
  setUploadedFileName,
  resetAI,
} = aiSlice.actions;

export default aiSlice.reducer;