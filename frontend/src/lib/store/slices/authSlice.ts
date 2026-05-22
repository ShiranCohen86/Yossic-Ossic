import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData { _id: string; name: string; email: string; role: 'teacher'|'student'; gradeLevel?: number; subjects?: string[]; isActive: boolean; }
interface AuthState { user: UserData|null; token: string|null; refreshToken: string|null; }

const loadFromStorage = (): AuthState => {
  if (typeof window === 'undefined') return { user: null, token: null, refreshToken: null };
  try {
    return { user: JSON.parse(localStorage.getItem('auth_user')||'null'), token: localStorage.getItem('auth_token'), refreshToken: localStorage.getItem('auth_refresh') };
  } catch { return { user: null, token: null, refreshToken: null }; }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromStorage,
  reducers: {
    setCredentials(state, action: PayloadAction<{user: UserData; token: string; refreshToken: string}>) {
      state.user = action.payload.user; state.token = action.payload.token; state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_refresh', action.payload.refreshToken);
    },
    clearCredentials(state) {
      state.user = null; state.token = null; state.refreshToken = null;
      localStorage.removeItem('auth_user'); localStorage.removeItem('auth_token'); localStorage.removeItem('auth_refresh');
    },
    updateTokens(state, action: PayloadAction<{token: string; refreshToken: string}>) {
      state.token = action.payload.token; state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('auth_token', action.payload.token); localStorage.setItem('auth_refresh', action.payload.refreshToken);
    },
  },
});

export const { setCredentials, clearCredentials, updateTokens } = authSlice.actions;
export default authSlice.reducer;
