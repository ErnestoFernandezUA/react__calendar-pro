import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../..';
import { Theme } from '../../../types/theme';

export interface OptionsState {
  theme: Theme,
  isDark: boolean;
}

const initialState: OptionsState = {
  theme: Theme.SYSTEM,
  isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
};

const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      switch (action.payload) {
        case Theme.DARK:
          state.theme = Theme.DARK;
          state.isDark = true;
          document.querySelector('body')?.setAttribute('data-theme', 'dark');
          break;

        case Theme.LIGHT:
          state.theme = Theme.LIGHT;
          state.isDark = false;
          document.querySelector('body')?.setAttribute('data-theme', 'light');
          break;

        default:
          state.theme = Theme.SYSTEM;
          state.isDark = window
            .matchMedia('(prefers-color-scheme: dark)').matches;
          document.querySelector('body')?.setAttribute('data-theme', window
            .matchMedia('(prefers-color-scheme: dark)')
            .matches ? 'dark' : 'light');
      }
    },
    resetState: () => {
      return initialState;
    },
  },
});

export default optionsSlice.reducer;
export const {
  setTheme,
  resetState,
} = optionsSlice.actions;

export const selectOptions = (state: RootState) => state.options;
export const selectTheme = (state: RootState) => state.options.theme;
export const selectIsDarkTheme = (state: RootState) => state.options.isDark;
