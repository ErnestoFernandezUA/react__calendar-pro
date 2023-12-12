import { DraggableLocation } from 'react-beautiful-dnd';
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../..';
import todos from '../../../server/todos.json';
import { TodoType } from '../../../types/todo';
import { getStartDay } from '../../../utils/getStartDay';

export interface TodosState {
  storage: TodoType[];
  preparedTodos: Record<string, TodoType[]>;
  statusLoading: 'idle' | 'loading' | 'failed';
  error: unknown;

  activeTodo: TodoType | null;
}

const initialState: TodosState = {
  storage: [],
  preparedTodos: {},
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

    return response;
  },
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    saveTodo: (state: TodosState, action: PayloadAction<TodoType>) => {
      const todo = action.payload;
      const startDay = getStartDay(todo.date);

      if (!(startDay in state.preparedTodos)) {
        state.preparedTodos = {
          ...state.preparedTodos,
          [startDay]: [todo],
        };
      }

      const index = state.preparedTodos[startDay]
        .findIndex(t => (t.todoId === todo.todoId));

      if (index >= 0) {
        // eslint-disable-next-line no-console
        console.log('todo exist', index);

        state.preparedTodos = {
          ...state.preparedTodos,
          [startDay]: state.preparedTodos[startDay]
            .map(t => (t.todoId === todo.todoId ? todo : t)),
        };
      } else {
        // eslint-disable-next-line no-console
        console.log('todo NOT exist', index, state.preparedTodos[startDay]);

        state.preparedTodos = {
          ...state.preparedTodos,
          [startDay]: [...state.preparedTodos[startDay], todo],
        };
      }
    },
    moveTodo: (state: TodosState, action: PayloadAction<{
      destination: DraggableLocation;
      source: DraggableLocation;
      draggableId: string;
    }>) => {
      // eslint-disable-next-line no-console
      console.log('moveTodo', state, action.payload);

      const { source, destination } = action.payload;

      const newSource = [...state.preparedTodos[source.droppableId]];
      const [movingTodo] = newSource.splice(source.index, 1);
      const newDestination = [
        ...(state.preparedTodos[destination.droppableId] || [])];

      newDestination.splice(destination.index, 0, movingTodo);

      // eslint-disable-next-line no-console
      console.log(newSource);

      state.preparedTodos = {
        ...state.preparedTodos,
        [source.droppableId]: newSource,
        [destination.droppableId]: newDestination,
      };
    },
    deleteTodo: (state: TodosState, action: PayloadAction<TodoType>) => {
      const startDay = getStartDay(action.payload.date);

      state.preparedTodos = {
        ...state.preparedTodos,
        [startDay]: state.preparedTodos[startDay]
          .filter(t => t.todoId !== action.payload.todoId),
      };
    },
    setActiveTodo: (state: TodosState, action: PayloadAction<TodoType>) => {
      // eslint-disable-next-line no-console
      console.log('todosSlice setActiveTodo', action.payload);

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
        // eslint-disable-next-line no-console
        console.log('getTodosAsync.fulfilled', action.payload);

        state.storage.push(...action.payload);
        state.statusLoading = 'idle';

        const todosPayload = action.payload;
        const prepared: Record<string, TodoType[]> = { ...state.preparedTodos };

        for (let i = 0; i < todosPayload.length; i += 1) {
          const startDay = getStartDay(todosPayload[i].date);

          if (startDay in prepared) {
            prepared[startDay].push(todosPayload[i]);
          } else {
            prepared[startDay] = [todosPayload[i]];
          }
        }

        state.preparedTodos = {
          ...state.preparedTodos,
          ...prepared,
        };
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
  saveTodo,
  setActiveTodo,
  clearActiveTodo,
  moveTodo,
  deleteTodo,
  setStatus,
  setError,
  resetStateTodos,
} = todosSlice.actions;

export const selectStorageTodos = (state: RootState) => state.todos.storage;
export const selectTodos = (state: RootState) => state.todos.preparedTodos;
export const selectTodosStatusLoading
= (state: RootState) => state.todos.statusLoading;
export const selectTodosError = (state: RootState) => state.todos.error;
export const selectActiveTodo
= (state: RootState) => state.todos.activeTodo;
