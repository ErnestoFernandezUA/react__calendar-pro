import { FunctionComponent, useRef } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled, { css } from 'styled-components';
import {
  IS_MONDAY_FIRST_DAY_OF_WEEK,
  selectFormat,
  setFormat,
  setIntervalCalendar,
  setSpecialDate,
} from '../store/features/interval/intervalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Day } from './Day';
import { FORMAT } from '../utils/constants/FORMAT';
import { MONTH_NAMES } from '../utils/constants/MONTH';
import { WEEK } from '../utils/constants/WEEK';
import { moveTodo } from '../store/features/todos/todosSlice';

const Wrapper = styled.div<{ format?: string }>`
  ${({ format }) => {
    if (format === FORMAT.DAY) {
      return css`
        display: block;
      `;
    }

    if (format === FORMAT.YEAR) {
      return css`
        /* max-width: 200px; */
      `;
    }

    return '';
  }}
`;

const MonthTitle = styled.div<{ format?: string }>`
  ${({ format }) => (format === FORMAT.DAY) && css`
    display: none;
  `}

  ${({ format }) => (format === FORMAT.MONTH || format === FORMAT.WEEK) && css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    justify-items: center;

    margin-bottom: 10px;
  `}

  ${({ format }) => (format === FORMAT.YEAR) && css`
    padding: 10px;
  `}

  & button {
    cursor: pointer;
  }
`;

const MonthContainer = styled.div<{ format?: string }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  ${({ format }) => (format === FORMAT.DAY) && css`
    display: block;
  `}
`;

interface MonthProps {
  interval: number[];
}

export const Month: FunctionComponent<MonthProps> = ({ interval }) => {
  const dispatch = useAppDispatch();
  const format = useAppSelector(selectFormat);
  const monthName = useRef(new Date(interval[0]).getMonth());
  const countEmptyItem = useRef((new Date(interval[0]).getDay()
  + 7 - IS_MONDAY_FIRST_DAY_OF_WEEK) % 7);

  const empty = [];

  for (let i = 0; i < countEmptyItem.current; i += 1) {
    empty.push(-i);
  }

  const onMonthHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (format === FORMAT.MONTH) {
      return;
    }

    let monthValue: string | undefined;

    if (e.target instanceof HTMLButtonElement) {
      monthValue = e.target.dataset.monthValue;
    }

    if (monthValue) {
      dispatch(setSpecialDate(+monthValue));
      dispatch(setFormat(FORMAT.MONTH));
      dispatch(setIntervalCalendar());
    }
  };

  const preparedWeek = IS_MONDAY_FIRST_DAY_OF_WEEK
    ? WEEK.slice(1).concat(WEEK[0])
    : WEEK;

  const handleOnDragEnd = (results: DropResult) => {
    // eslint-disable-next-line no-console
    console.log('Main: handleOnDragEnd', results);

    const { destination, source, draggableId } = results;

    // eslint-disable-next-line no-console
    console.log(results);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return;
    }

    dispatch(moveTodo({ destination, source, draggableId }));
  };

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Wrapper format={format}>
          <MonthTitle format={format}>
            {format === FORMAT.YEAR ? (
              <button
                type="button"
                onClick={e => onMonthHandler(e)}
                data-month-value={String(interval[0])}
              >
                {MONTH_NAMES[monthName.current]}
              </button>
            ) : (
              preparedWeek.map(d => (
                <div key={d}>{d}</div>
              ))
            )}
          </MonthTitle>

          <MonthContainer format={format}>
            {empty.map((emptyItem: number) => (
              <Day key={emptyItem} startDay={emptyItem} disabled />
            ))}

            {interval.map((day: number) => (
              <Day key={day} startDay={day} />
            ))}
          </MonthContainer>
        </Wrapper>
      </DragDropContext>
    </>
  );
};
