import { useEffect } from 'react';
import {
  selectTheme,
  setTheme,
} from './store/features/options/optionsSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { Theme } from './types/theme';
import {
  selectCurrentDate,
  setCurrentDate,
  setFormat,
  setIntervalCalendar,
} from './store/features/interval/intervalSlice';
import { FORMAT } from './utils/constants/FORMAT';
import './App.scss';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { getTodosAsync } from './store/features/todos/todosSlice';

export default function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const currentDate = useAppSelector(selectCurrentDate);

  useEffect(() => {
    dispatch(setTheme(theme === Theme.SYSTEM ? Theme.SYSTEM : theme));
  }, []);

  useEffect(() => {
    if (!currentDate) {
      dispatch(setCurrentDate());
      dispatch(setFormat(FORMAT.MONTH));
    }

    dispatch(setIntervalCalendar());
  }, []);

  useEffect(() => {
    dispatch(getTodosAsync());
  }, []);

  return (
    <div className="App">
      <Header />
      <Main />
    </div>
  );
}
