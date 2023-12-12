import styled, { css } from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';

import {
  selectCurrentDate,
  selectFormat,
  setFormat,
  setIntervalCalendar,
  setSpecialDate,
} from '../store/features/interval/intervalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { FORMAT } from '../utils/constants/FORMAT';
import { useCurrent } from '../hooks/useCurrent';
import {
  // selectStorageTodos,
  selectTodos,
} from '../store/features/todos/todosSlice';
import { useDay } from '../hooks/useDay';
import { DayBody } from './DayBody';

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
    border: 1px solid red;
  `}

  ${({ format }) => (format === FORMAT.DAY) && css`
  `}

  ${({ $isCurrentDay }) => (!$isCurrentDay) && css`
    cursor: pointer;

    &:hover{
      box-shadow: var(--box-shadow-color) 0px 1px 4px;
    }

    &:hover > div:first-child {
      background-color: rgb(121, 198, 198, 50%);
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

// const DayListTodos = styled.div<{ format?: string }>`
//   box-sizing: border-box;
//   padding: 10px;
// `;

interface DayProps {
  startDay: number;
  disabled?: boolean;
}

export const Day: React.FC<DayProps> = ({
  startDay,
  disabled = false,
}) => {
  const dispatch = useAppDispatch();
  const currentDate = useAppSelector(selectCurrentDate);
  const format = useAppSelector(selectFormat);
  const {
    dayOfWeek, month, day, year, fullNameDayOfWeek,
    isFirstDayOfMonth,
    isLastDayOfMonth,
    isWeekend,
    // startDay: startDayHook,
  } = useDay(startDay);

  // eslint-disable-next-line no-console
  // console.log('startDay', startDay, 'startDayHook', startDayHook,
  //   startDay === startDayHook);

  const {
    isCurrentDay,
    isCurrentMonth,
  } = useCurrent(currentDate, startDay);
  const todos = useAppSelector(selectTodos)[startDay] || [];
  const isTodosToday = !!todos.length;

  const onDayClick = () => {
    // eslint-disable-next-line no-console
    console.log('onDayClick');

    if (isCurrentDay && format === FORMAT.DAY) {
      return;
    }

    // if (isCurrentDay) {
    //   dispatch(setFormat(FORMAT.DAY));
    //   dispatch(setIntervalCalendar());

    //   return;
    // }

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
      onClick={onDayClick}
    >
      <DayTitle
        $isCurrentDay={isCurrentDay}
        format={format}
      >
        <DayOfWeek
          onClick={(e) => onWeekClick(e)}
          data-day-value={String(startDay)}
          format={format}
          $isWeekend={isWeekend}
          $isCurrentDay={isCurrentDay}
        >
          {format === FORMAT.DAY && fullNameDayOfWeek}
          {(format === FORMAT.WEEK || format === FORMAT.MONTH)
          && dayOfWeek}

        </DayOfWeek>

        <DateString format={format}>
          {format === FORMAT.DAY
            ? `${day}/${month}/${year}`
            : `${day}`}

          {(isFirstDayOfMonth || isLastDayOfMonth || isCurrentDay)
            && (format === FORMAT.MONTH || format === FORMAT.WEEK)
            && ` ${month}`}

          {format !== FORMAT.YEAR && isTodosToday
          && (` :  ${todos.length} todos`)}
        </DateString>
      </DayTitle>

      <Droppable droppableId={String(startDay)} type="groupe">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <DayBody
              startDay={startDay}
              todos={todos}
              placeholder={provided.placeholder}
            />
          </div>
        )}
      </Droppable>
    </Wrapper>
  );
};
