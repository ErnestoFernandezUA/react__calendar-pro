/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../..';
import todos from '../../../server/todos.json';
import { TodoType } from '../../../types/todo';

export interface TodosState {
  storage: TodoType[];
  statusLoading: 'idle' | 'loading' | 'failed';
  error: unknown;

  activeTodo: TodoType | null;
}

const initialState: TodosState = {
  storage: [],
  statusLoading: 'idle',
  error: null,

  activeTodo: null,
};

const getTodos = async (delay = 3000): Promise<TodoType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(todos as unknown as TodoType[]);
    }, delay);
  });
};

export const getTodosAsync = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response: TodoType[] = await getTodos();

    // eslint-disable-next-line no-console
    console.log(response);

    return response;
  },
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state: TodosState, action: PayloadAction<TodoType>) => {
      state.storage.push(action.payload);
    },
    // changeTodo: (
    //   state: TodosState,
    //   action: PayloadAction<{ todoId: string, todo: TodoType }>,
    // ) => {
    //   state.storage = state.storage.map(todo => {
    //     if (todo.todoId === action.payload.todoId) {
    //       return action.payload.todo;
    //     }

    //     return todo;
    //   });
    // },

    saveTodo: (state: TodosState, action: PayloadAction<TodoType>) => {
      state.storage = [...state.storage
        .filter(t => t.todoId !== action.payload.todoId), action.payload];
    },
    deleteTodo: (state: TodosState, action: PayloadAction<TodoType>) => {
      state.storage = state.storage
        .filter(t => t.todoId !== action.payload.todoId);
    },
    setActiveTodo: (state: TodosState, action: PayloadAction<TodoType>) => {
      state.activeTodo = action.payload;
    },
    clearActiveTodo: (state: TodosState) => {
      state.activeTodo = null;
    },
    randomizeTodos: (
      // state: TodosState, action: PayloadAction<Todo>,
    ) => {
      // state.storage = state.storage.map(todo => {
      //   if (todo.todoId === action.payload.todoId) {
      //     return action.payload;
      //   }

      //   return todo;
      // });
    },
    setStatus: (
      state: TodosState,
      action: PayloadAction<'idle' | 'loading' | 'failed'>,
    ) => {
      state.statusLoading = action.payload;
    },
    setError: (state: TodosState, action: PayloadAction<unknown>) => {
      state.error = action.payload;
      state.statusLoading = 'failed';
    },
    resetStateTodos: () => {
      // eslint-disable-next-line no-console
      console.log('reset todos');

      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodosAsync.pending, (state: TodosState) => {
        state.statusLoading = 'loading';
      })
      .addCase(getTodosAsync.fulfilled, (state, action) => {
        state.storage.push(...action.payload);
        state.statusLoading = 'idle';
      })
      .addCase(getTodosAsync.rejected, (state, action) => {
        state.statusLoading = 'failed';

        // eslint-disable-next-line no-console
        console.log(action);
      });
  },
});

export default todosSlice.reducer;
export const {
  addTodo,
  // changeTodo,
  saveTodo,
  setActiveTodo,
  clearActiveTodo,
  deleteTodo,
  setStatus,
  setError,
  resetStateTodos,
} = todosSlice.actions;

export const selectTodos = (state: RootState) => state.todos.storage;
export const selectTodosStatusLoading
= (state: RootState) => state.todos.statusLoading;
export const selectTodosError = (state: RootState) => state.todos.error;
export const selectActiveTodo
= (state: RootState) => state.todos.activeTodo;
