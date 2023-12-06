import {
  FunctionComponent, useEffect, useState,
} from 'react';
import styled, { css } from 'styled-components';

import {
  selectCurrentDate,
  selectFormat,
  setFormat,
  setIntervalCalendar,
  setSpecialDate,
} from '../store/features/interval/intervalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { TodoList } from './TodoList';
import { FORMAT } from '../utils/constants/FORMAT';
import { useCurrent } from '../hooks/useCurrent';
import { TodoType } from '../types/todo';
import { useDay } from '../hooks/useDay';
import { selectTodos } from '../store/features/todos/todosSlice';

type StyledProps = {
  format?: string,
  $isWeekend?: boolean,
  $isNotCurrentMonth?: boolean,
  $isCurrentDay?: boolean;
  $isTodosToday?: boolean;
};

const Wrapper = styled.div<StyledProps>`
  box-sizing: border-box;
  padding: 0;
  cursor: pointer;
  user-select: none;

  ${({ format }) => (format === FORMAT.YEAR) && css`
    border-radius: 0.5em;
    overflow: hidden;
  `}

  ${({ format }) => (format === FORMAT.DAY) && css`
    height: 100vh;
  `}

  ${({ format }) => (format === FORMAT.WEEK || format === FORMAT.MONTH) && css`
    height: calc(80vh / 5) ;
    cursor: pointer;

    &:hover{
      box-shadow: var(--box-shadow-color) 0px 1px 4px;
    }
  `}

  ${({ format, $isWeekend: isWeekend }) => (format === FORMAT.YEAR && isWeekend) && css`
    color: red;
  `}

  ${({ $isNotCurrentMonth: isNotCurrentMonth }) => isNotCurrentMonth && css`
    opacity: 0.4;
  `}

  ${({ $isCurrentDay: isCurrentDay, format }) => isCurrentDay && format !== FORMAT.DAY && css`
    box-shadow: var(--box-shadow-color) 0px 1px 4px;
  `}

  ${({ $isTodosToday: isTodosToday, format }) => isTodosToday
    && format === FORMAT.YEAR
    && css`
      background-color: var(--foreground-color);
    `}
`;

const DayTitle = styled.div<{ $isCurrentDay: boolean, format: string }>`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${({ format }) => format === FORMAT.YEAR && css`
    line-height: 3em;
    /* font-size: 0.8em; */
  `}

  ${({ $isCurrentDay }) => $isCurrentDay && css`
    background-color: #79c6c6;
  `}


  ${({ $isCurrentDay }) => $isCurrentDay && css`
    &:hover {
      background-color: var(--toggle-bg);
    }
  `}
`;

const DayBody = styled.div<{ format: string }>`
  ${({ format }) => format !== FORMAT.YEAR && css`
    height: 11em;
  `}

  &:hover {
  }
`;

const DayOfWeek = styled.button<StyledProps>`
  display: none;
  cursor: pointer;
  /* padding: 0 10px; */
  /* line-height: 30px; */
  border: none;
  outline: none;
  position: relative;
  cursor: pointer;
  text-align: left;

  /* border-right: 10px solid transparent; */
  width: 80px;
  /* border-top: 10px solid transparent; */
  /* border-bottom: 10px solid transparent; */

  ${({ $isWeekend: isWeekend }) => isWeekend && css`
    color: #a16e73;
    font-weight: bold;
  `}

  ${({ $isCurrentDay: isCurrentDay, format }) => !isCurrentDay
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
  /* line-height: 40px; */
  position: relative;
  overflow: hidden;
  /* padding: 0 10px; */

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
  const [isCreatingNewTodo, setIsCreatingNewTodo] = useState<boolean>(false);
  const [preparedTodos, setPreparedTodos] = useState<TodoType[]>([]);

  useEffect(() => {
    const InitialTodo: TodoType = {
      todoId: `${new Date().valueOf()}`,
      title: '',
      description: '',
      date: startDay,
      color: '',
    };

    setPreparedTodos(isCreatingNewTodo
      ? [InitialTodo, ...todos.filter((todo: TodoType) => {
        return (startDay <= todo.date)
        && (todo.date < startDay + 24 * 60 * 60 * 1000);
      })]
      : todos.filter((todo: TodoType) => {
        return (startDay <= todo.date)
        && (todo.date < startDay + 24 * 60 * 60 * 1000);
      }));
  }, [isCreatingNewTodo, format, todos]);

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
    // eslint-disable-next-line no-console
    console.log('onDayBodyClick');

    dispatch(setSpecialDate(startDay));
    setIsCreatingNewTodo(true);
  };

  if (disabled) {
    return (
      <div />
    );
  }

  return (
    <Wrapper
      format={format}
      $isWeekend={isWeekend}
      $isNotCurrentMonth={!isCurrentMonth}
      $isCurrentDay={isCurrentDay}
      $isTodosToday={isTodosToday}
    >
      <DayTitle
        $isCurrentDay={isCurrentDay}
        format={format}
        onClick={onDayClick}
      >
        <DayOfWeek
          onClick={(e) => onWeekClick(e)}
          data-day-value={String(startDay)}
          format={format}
          $isWeekend={isWeekend}
          $isCurrentDay={isCurrentDay}
        >
          {format === FORMAT.DAY && fullNameDayOfWeek}
          {(format === FORMAT.WEEK || format === FORMAT.MONTH) && dayOfWeek}
        </DayOfWeek>

        <DateString format={format}>
          {format === FORMAT.DAY
            ? `${day}/${month}/${year}`
            : `${day}`}

          {(isFirstDayOfMonth || isLastDayOfMonth || isCurrentDay)
            && (format === FORMAT.MONTH || format === FORMAT.WEEK)
            && ` ${month}`}

        </DateString>
      </DayTitle>

      <DayBody
        onClick={onDayBodyClick}
        // onBlur={() => console.log('onBlur day body')}
        format={format}
      >
        {(format !== FORMAT.YEAR) && isTodosToday && (
          <DayListTodos format={format}>
            <TodoList
              todos={preparedTodos}
              isCreatingNewTodo={isCreatingNewTodo}
              setIsCreatingNewTodo={setIsCreatingNewTodo}
            />
          </DayListTodos>
        )}
      </DayBody>
    </Wrapper>
  );
};
