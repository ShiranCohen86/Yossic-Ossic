import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast { id: string; message: string; type: 'success'|'error'|'info'; }

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toasts: [] as Toast[] },
  reducers: {
    addToast(state, action: PayloadAction<Omit<Toast,'id'>>) { state.toasts.push({...action.payload, id: Date.now().toString()}); },
    removeToast(state, action: PayloadAction<string>) { state.toasts = state.toasts.filter(t=>t.id!==action.payload); },
  },
});

export const { addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
