import { useEffect } from 'react';
import {
  selectTheme,
  setTheme,
} from './store/features/options/optionsSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { Theme } from './types/theme';
import {
  selectCurrentDate,
  selectEndInterval,
  selectFormat,
  selectStartInterval,
  setCurrentDate,
  setFormat,
  setIntervalCalendar,
} from './store/features/interval/intervalSlice';
import { buildInterval } from './helpers/buildInterval';
import { FORMAT } from './utils/constants/FORMAT';
import { Year } from './components/Year';
import { Month } from './components/Month';
import { Day } from './components/Day';
import './App.scss';
import { Header } from './components/Header';

export default function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const currentDate = useAppSelector(selectCurrentDate);

  const start = useAppSelector(selectStartInterval);
  const end = useAppSelector(selectEndInterval);
  const interval = buildInterval(start, end);
  const format = useAppSelector(selectFormat);

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

  return (
    <div className="App">
      <Header />

      <main>
        {/* <ChartViewer /> */}
        {/* <DataViewer /> */}

        {format === FORMAT.YEAR && <Year interval={interval} />}

        {(format === FORMAT.MONTH || format === FORMAT.WEEK)
          && <Month interval={interval} />}

        {format === FORMAT.DAY && <Day startDay={interval[0]} />}
      </main>
    </div>
  );
}
