import {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import styled, { css } from 'styled-components';

import {
  selectFormat,
  setSpecialDate,
} from '../store/features/interval/intervalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { FORMAT } from '../utils/constants/FORMAT';
import { TodoType } from '../types/todo';
import { TodoList } from './TodoList';
import { useDay } from '../hooks/useDay';
// import { Todo } from './Todo';
import { selectActiveTodo } from '../store/features/todos/todosSlice';

// type StyledProps = {
//   format?: string,
//   $isWeekend?: boolean,
//   $isNotCurrentMonth?: boolean,
//   $isCurrentDay?: boolean;
//   $isTodosToday?: boolean;
// };

const Wrapper = styled.div<{ format: string }>`
  ${({ format }) => format !== FORMAT.YEAR && css`
    height: 11em;
  `}

  &:hover {
  }
`;

// const DayOfWeek = styled.button<StyledProps>`
//   display: none;
//   cursor: pointer;
//   /* padding: 0 10px; */
//   /* line-height: 30px; */
//   border: none;
//   outline: none;
//   position: relative;
//   cursor: pointer;
//   text-align: left;

//   /* border-right: 10px solid transparent; */
//   width: 80px;
//   /* border-top: 10px solid transparent; */
//   /* border-bottom: 10px solid transparent; */

//   ${({ $isWeekend: isWeekend }) => isWeekend && css`
//     color: #a16e73;
//     font-weight: bold;
//   `}

//   ${({ $isCurrentDay: isCurrentDay, format }) => !isCurrentDay
//   && format !== FORMAT.WEEK && css`
//     &:hover {
//       transition: all 0.2s;
//       border-bottom: 10px solid #79c6c6;
//     }
//   `}

//   ${({ format }) => (format === FORMAT.DAY)
//   && css`
//     display: block;
//   `}
// `;

// const DateString = styled.p<{ format?: string }>`
//   margin: 0;
//   /* line-height: 40px; */
//   position: relative;
//   overflow: hidden;
//   /* padding: 0 10px; */

//   ${({ format }) => format === FORMAT.YEAR && css`
//     display: block;
//     text-align: right;
//     padding: 0;
//     margin: 0 auto;
//   `}
// `;

const DayListTodos = styled.div<{ format?: string }>`
  box-sizing: border-box;
  padding: 10px;
`;

interface DayBodyProps {
  startDay: number;
  todos: TodoType[];
  // isActive: boolean;
}

export const DayBody: FunctionComponent<DayBodyProps> = ({
  startDay,
  todos,
  // isActive,
}) => {
  const dispatch = useAppDispatch();
  const format = useAppSelector(selectFormat);
  const activeTodo = useAppSelector(selectActiveTodo);
  // const isWeekend = (new Date(startDay).getDay() === 0
  // || new Date(startDay).getDay() === 6);
  // const {
  //   day,
  // } = useDay(startDay);
  // const isTodosToday = !!todos.length;
  const [isCreating, setIsCreating] = useState<boolean>(false);
  // const [activeInputRef, setActiveInputRef]
  // = useState<React.RefObject<HTMLInputElement> | null>(null);

  const { day } = useDay(startDay);

  const onDayBodyClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // eslint-disable-next-line no-console
      console.log('onDayBodyClick', day);

      dispatch(setSpecialDate(startDay));
      setIsCreating(true);
    }
  };

  // useEffect(() => {
  //   if (isCreating && activeInputRef && activeInputRef.current) {
  //     // eslint-disable-next-line no-console
  //     console.log('activeInputRef.current.focus();');

  //     // activeInputRef.current.focus();
  //   }
  // }, [isCreating, activeInputRef]);

  const newTodo = {
    todoId: `${new Date().valueOf()}`,
    title: '',
    description: '',
    date: startDay,
    color: '',
  };

  // eslint-disable-next-line no-console
  // console.log('onDayBody', day, isActive, activeInputRef);

  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   // console.log('render dayBody', day);
  // }, [todos.length, isActive]);

  useEffect(() => {
    // if (activeInputRef?.current) {
    //   activeInputRef?.current.focus();
    // }
  }, [activeTodo]);

  return (
    <Wrapper
      onClick={e => onDayBodyClick(e)}
      // onBlur={() => console.log('onBlur day body')}
      format={format}
    >
      {(format !== FORMAT.YEAR) && (
        <DayListTodos format={format}>
          <TodoList
            todos={todos}
            today={startDay}
            // newTodo={newTodo}
            // setActiveInputRef={setActiveInputRef}
          />

          {isCreating && (
            <TodoList
              todos={[newTodo]}
              today={startDay}
              // newTodo={newTodo}
              // setActiveInputRef={setActiveInputRef}
            />
          )}
        </DayListTodos>
      )}
    </Wrapper>
  );
};
