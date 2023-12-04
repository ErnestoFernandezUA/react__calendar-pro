import styled from 'styled-components';

import { IoCaretBackOutline, IoCaretForwardOutline } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  navigateDay,
  navigateMonth,
  navigateWeek,
  navigateYear,
  selectCurrentDate,
  selectFormat,
  setIntervalCalendar,
} from '../store/features/interval/intervalSlice';
import { FORMAT } from '../utils/constants/FORMAT';
import { MOVE } from '../utils/constants/MOVE';
import { useDay } from '../hooks/useDay';

const Wrapper = styled.div`
  display: flex;`;

const Arrow = styled.button`
  padding: 0;
  border: none;
  outline: none;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
`;

const Value = styled.div<{ format: string }>`
  padding: 0 1em;
  text-align: center;
`;

export const ArrowNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentDate = useAppSelector(selectCurrentDate);
  const format = useAppSelector(selectFormat);
  const {
    day, weekOfYear, month, year,
  } = useDay(currentDate);

  const onNavigateHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (format === FORMAT.DAY) {
      dispatch(navigateDay(e.currentTarget.value));
    }

    if (format === FORMAT.WEEK) {
      dispatch(navigateWeek(e.currentTarget.value));
    }

    if (format === FORMAT.MONTH) {
      dispatch(navigateMonth(e.currentTarget.value));
    }

    if (format === FORMAT.YEAR) {
      dispatch(navigateYear(e.currentTarget.value));
    }

    dispatch(setIntervalCalendar());
  };

  return (
    <Wrapper>
      <Arrow
        type="button"
        value={MOVE.BACK}
        onClick={onNavigateHandler}
      >
        <IoCaretBackOutline />
      </Arrow>

      <Value format={format}>
        {format === FORMAT.DAY && (
          <>
            {day}
            &nbsp;
            {month}
            &nbsp;
            {year}
          </>
        )}

        {format === FORMAT.WEEK && (
          <>
            {weekOfYear}
            -th week of&nbsp;
            {year}
          </>
        )}

        {format === FORMAT.MONTH && (
          <>
            {month}
            &nbsp;
            {year}
          </>
        )}

        {format === FORMAT.YEAR && (
          <>
            &nbsp;
            {year}
          </>
        )}
      </Value>

      <Arrow
        type="button"
        value={MOVE.FORWARD}
        onClick={onNavigateHandler}
      >
        <IoCaretForwardOutline />
      </Arrow>
    </Wrapper>
  );
};
