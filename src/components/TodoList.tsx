import {
  // Dispatch,
  // ChangeEvent,
  FunctionComponent,
  // ReactNode,
  // RefObject, SetStateAction,
  // useEffect,
} from 'react';
import styled from 'styled-components';
import {
  IoEllipsisHorizontal,
  // IoClose,
  // IoBuild,
  // IoCart,
} from 'react-icons/io5';

import { selectFormat } from '../store/features/interval/intervalSlice';
import { useAppSelector } from '../store/hooks';
import { FORMAT } from '../utils/constants/FORMAT';
import { TodoType } from '../types/todo';
// import { POPUP } from '../utils/constants/POPUP';
// import { deleteTodo } from '../store/features/todos/todosSlice';
// import { Button } from './UI/Button';
import { Todo } from './Todo';
// import { useDay } from '../hooks/useDay';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// const TodoContainer = styled.div<{ format?: string }>`
//   width: 100%;
//   line-height: 14px;
//   padding: 0;
//   margin: 0;
//   display: flex;
//   flex-direction: row;
//   align-items: stretch;

//   & div {
//     margin-bottom: 4px;
//     /* max-width: 100px; */
//   }

//   ${({ format }) => (format === FORMAT.YEAR)
//   && css`
//     display: none;
//   `}
// `;

// const TodoTitle = styled.div<{ color: string, format?: string }>`
//   background-color: ${props => props.color};
//   color: var(--secondary-text-color);
//   padding: 7px 10px;
//   border-radius: 8px;
//   display: flex;
//   align-items: stretch;
//   justify-content: space-between;
//   width: 100%;
//   display: flex;
//   align-items: center;

//   & span {
//     ${({ format }) => (format === FORMAT.MONTH || format === FORMAT.WEEK) && css`
//       overflow: hidden;
//       text-overflow: ellipsis;
//       max-width: 100px;
//       white-space: nowrap;
//       display: -webkit-box;
//       -webkit-line-clamp: 1;
//       -webkit-box-direction: normal;
//       -webkit-box-orient: vertical;
//       overflow-wrap: break-word;
//     `}
//   }
// `;

interface TodoListProps {
  todos: TodoType[];
  // children?: React.ReactNode;
  today: number;
  // newTodo: ReactNode;
  // setActiveInputRef:
  // Dispatch<SetStateAction<RefObject<HTMLInputElement> | null>>;
}

export const TodoList: FunctionComponent<TodoListProps> = ({
  todos,
  // children,
  today,
  // newTodo,
  // setActiveInputRef,
}) => {
  // const { day } = useDay(today);
  const format = useAppSelector(selectFormat);
  const shortedListTodos = todos.filter((_, i) => ((format === FORMAT.MONTH)
    ? i < 4 : true));
  const isShowDots = (format === FORMAT.MONTH) && todos.length > 6;

  // useEffect(() => {
  //   const inputElement: HTMLInputElement | null
  //    = document.querySelector('.inputForFocus');

  //   if (inputElement) {
  //     inputElement.focus();
  //   }
  // }, [todos]);

  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('render todoList', day);
  // }, [todos.length]);

  return (
    <Wrapper>
      {shortedListTodos.map((todo) => (
        <Todo
          key={todo.todoId}
          todo={todo}
          // todosLength={todos.length}
          today={today}
          // setActiveInputRef={setActiveInputRef}
        />
      ))}

      {/* {newTodo} */}

      {isShowDots && <IoEllipsisHorizontal />}
    </Wrapper>
  );
};
