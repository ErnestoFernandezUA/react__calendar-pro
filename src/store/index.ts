import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// eslint-disable-next-line import/no-cycle
import controlsWeatherSlice from
  './features/controlsWeather/controlsWeatherSlice';
// eslint-disable-next-line import/no-cycle
import cashSlice from './features/cash/cashSlice';
// eslint-disable-next-line import/no-cycle
import optionsSlice from './features/options/optionsSlice';
// eslint-disable-next-line import/no-cycle
import controlsSlice from './features/controls/controlsSlice';
// eslint-disable-next-line import/no-cycle
import intervalSlice from './features/interval/intervalSlice';
// eslint-disable-next-line import/no-cycle
import todosSlice from './features/todos/todosSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'cash', 'controls', 'options', 'interval',
  ],
  blacklist: ['user'],
};

const rootReducer = combineReducers({
  controlsWeather: controlsWeatherSlice,
  controls: controlsSlice,
  cash: cashSlice,
  options: optionsSlice,
  interval: intervalSlice,
  todos: todosSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: true,
    serializableCheck: {
      ignoredActions: [
        FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
        // 'posts',
      ],
    },
  }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
