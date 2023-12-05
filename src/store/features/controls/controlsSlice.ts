/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../..';
import { TodoType } from '../../../types/todo';
import { PopupValues } from '../../../types/popup';

export interface ControlsState {
  popup: {
    isShowDatePicker: boolean;
    isShowForm: boolean;
  },
  todo: TodoType | null;
}

const initialState: ControlsState = {
  popup: {
    isShowDatePicker: false,
    isShowForm: false,
  },
  todo: null,
};

const controlsSlice = createSlice({
  name: 'controls',
  initialState,
  reducers: {
    switchPopup: (
      state: ControlsState,
      action: PayloadAction<PopupValues>,
    ) => {
      state.popup = {
        ...initialState.popup,
        [action.payload]: !state.popup[action.payload],
      };
    },
    closeAllPopup: (
      state: ControlsState,
    ) => {
      state.popup = {
        ...initialState.popup,
      };
    },
    sentTodoToForm: (
      state: ControlsState,
      action: PayloadAction<TodoType>,
    ) => {
      state.todo = action.payload;
    },
    resetTodo: (state: ControlsState) => {
      state.todo = initialState.todo;
    },
    resetState: (state: ControlsState) => {
      return { ...state, ...initialState };
    },
  },
});

export default controlsSlice.reducer;
export const {
  switchPopup,
  closeAllPopup,
  resetState,
  resetTodo,
  sentTodoToForm,
} = controlsSlice.actions;

export const selectIsShowDatePicker
 = (state: RootState) => state.controls.popup.isShowDatePicker;
export const selectIsShowAddItem
= (state: RootState) => state.controls.popup.isShowForm;
export const selectTodoToForm
= (state: RootState) => state.controls.todo;
