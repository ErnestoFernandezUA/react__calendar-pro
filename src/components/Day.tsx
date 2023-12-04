import {
  FunctionComponent,
} from 'react';
import styled, { css } from 'styled-components';

// import { FORMAT } from '../constants/FORMAT';
// import { useCurrentHook } from '../customHooks/useCurrentHook';
import {
  selectCurrentDate,
  selectFormat,
  selectTodos,
  setFormat,
  setIntervalCalendar,
  setSpecialDate,
} from '../store/features/interval/intervalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Todos } from './Todos';
import { FORMAT } from '../utils/constants/FORMAT';
import { useCurrent } from '../hooks/useCurrent';
import { Todo } from '../types/todo';
import { useDay } from '../hooks/useDay';
import { closeAllPopup } from '../store/features/controls/controlsSlice';

type StyledProps = {
  format?: string,
  isWeekend?: boolean,
  isNotCurrentMonth?: boolean,
  isCurrentDay?: boolean;
  isTodosToday?: boolean;
};

const Wrapper = styled.div<StyledProps>`
  box-sizing: border-box;
  padding: 0;
  font-size: 14px;
  cursor: pointer;


  ${({ format }) => (format === FORMAT.DAY) && css`
    height: 100vh;
  `}

  ${({ format }) => (format === FORMAT.WEEK || format === FORMAT.MONTH) && css`
    height: 205px;
    cursor: pointer;

    &:hover{
      box-shadow: var(--box-shadow-color) 0px 1px 4px;
    }
  `}

  ${({ format, isWeekend }) => (format === FORMAT.YEAR && isWeekend) && css`
    color: red;
  `}

  ${({ isNotCurrentMonth }) => isNotCurrentMonth && css`
    opacity: 0.4;
  `}

  ${({ isCurrentDay, format }) => isCurrentDay && format !== FORMAT.DAY && css`
    box-shadow: var(--box-shadow-color) 0px 1px 4px;
  `}

  ${({ isTodosToday, format }) => isTodosToday
    && format === FORMAT.YEAR
    && css`
      background-color: #f3f6f4;
    `}
`;

const DayTitle = styled.div<{ isCurrentDay: boolean }>`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${({ isCurrentDay }) => isCurrentDay && css`
    background-color: #79c6c6;
  `}

  ${({ isCurrentDay }) => !isCurrentDay && css`
    &:hover {
      background-color: var(--toggle-bg);
    }
  `}
`;

const DayBody = styled.div`
`;

const DayOfWeek = styled.button<StyledProps>`
  display: none;
  cursor: pointer;
  padding: 0 10px;
  line-height: 30px;
  border: none;
  outline: none;
  position: relative;
  cursor: pointer;
  text-align: left;

  border-right: 10px solid transparent;
  width: 80px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;

  ${({ isWeekend }) => isWeekend && css`
    color: #a16e73;
    font-weight: bold;
  `}


  ${({ isCurrentDay, format }) => !isCurrentDay
  && format !== FORMAT.WEEK && css`
    &:hover {
      transition: all 0.2s;
      border-bottom: 10px solid #79c6c6;
    }
  `}

  ${({ format }) => (format === FORMAT.DAY)
  && css`
    display: block;
  `}
`;

const DateString = styled.p<{ format?: string }>`
  margin: 0;
  line-height: 40px;
  position: relative;
  overflow: hidden;
  padding: 0 10px;

  ${({ format }) => format === FORMAT.YEAR && css`
    display: block;
    text-align: right;
    padding: 0;
    margin: 0 auto;
  `}
`;

const DayListTodos = styled.div<{ format?: string }>`
  box-sizing: border-box;
  padding: 10px;
`;

interface DayProps {
  startDay: number;
  disabled?: boolean;
}

export const Day: FunctionComponent<DayProps> = ({
  startDay,
  disabled = false,
}) => {
  const dispatch = useAppDispatch();
  const currentDate = useAppSelector(selectCurrentDate);
  const format = useAppSelector(selectFormat);
  const isWeekend = (new Date(startDay).getDay() === 0
  || new Date(startDay).getDay() === 6);
  const {
    dayOfWeek, month, day, year, fullNameDayOfWeek,
    isFirstDayOfMonth,
    isLastDayOfMonth,
  } = useDay(startDay);
  const {
    isCurrentDay,
    isCurrentMonth,
  } = useCurrent(currentDate, startDay);
  const todos = useAppSelector(selectTodos);

  const preparedTodos = todos.filter((todo: Todo) => {
    return (startDay <= todo.date)
    && (todo.date < startDay + 24 * 60 * 60 * 1000);
  });

  const isTodosToday = !!preparedTodos.length;

  const onDayClick = () => {
    if (isCurrentDay && format === FORMAT.DAY) {
      return;
    }

    if (isCurrentDay) {
      dispatch(setFormat(FORMAT.DAY));
      dispatch(setIntervalCalendar());

      return;
    }

    if (!disabled) {
      dispatch(setSpecialDate(startDay));
    }

    if (!disabled && !isCurrentMonth) {
      dispatch(setIntervalCalendar());
    }
  };

  const onWeekClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
  ) => {
    if (format === FORMAT.WEEK) {
      return;
    }

    e.stopPropagation();
    let dayValue: string | undefined;

    if (e.target instanceof HTMLButtonElement) {
      dayValue = e.target.dataset.dayValue;
    }

    if (dayValue) {
      dispatch(setSpecialDate(+dayValue));
      dispatch(setFormat(FORMAT.WEEK));
      dispatch(setIntervalCalendar());
    }
  };

  const onDayBodyClick = () => {
    dispatch(closeAllPopup());
  };

  if (disabled) {
    return (
      <div />
    );
  }

  // eslint-disable-next-line no-console
  console.log(day, dayOfWeek);

  return (
    <Wrapper
      format={format}
      isWeekend={isWeekend}
      isNotCurrentMonth={!isCurrentMonth}
      isCurrentDay={isCurrentDay}
      isTodosToday={isTodosToday}
    >
      <DayTitle
        isCurrentDay={isCurrentDay}
        onClick={onDayClick}
      >
        <DayOfWeek
          isWeekend={isWeekend}
          onClick={(e) => onWeekClick(e)}
          data-day-value={String(startDay)}
          isCurrentDay={isCurrentDay}
          format={format}
        >
          {format === FORMAT.DAY && fullNameDayOfWeek}
          {(format === FORMAT.WEEK || format === FORMAT.MONTH) && dayOfWeek}
        </DayOfWeek>

        <DateString format={format}>
          {format === FORMAT.DAY
            ? `${day}/${month}/${year}`
            : `${day}`}

          {(isFirstDayOfMonth || isLastDayOfMonth)
            && (format === FORMAT.MONTH || format === FORMAT.WEEK)
            && ` ${month}`}

          &nbsp;
          {day + dayOfWeek}
        </DateString>
      </DayTitle>

      <DayBody onClick={onDayBodyClick}>
        {(format !== FORMAT.YEAR) && isTodosToday && (
          <DayListTodos format={format}>
            <Todos todos={preparedTodos} />
          </DayListTodos>
        )}
      </DayBody>
    </Wrapper>
  );
};
