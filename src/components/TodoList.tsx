import {
  // ChangeEvent,
  FunctionComponent,
  useRef,
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
  isCreatingNewTodo: boolean;
  setIsCreatingNewTodo: (value: boolean) => void;
}

export const TodoList: FunctionComponent<TodoListProps> = ({
  todos,
  isCreatingNewTodo,
  setIsCreatingNewTodo,
}) => {
  // const dispatch = useAppDispatch();
  const format = useAppSelector(selectFormat);
  const todoRef = useRef<HTMLDivElement>(null);

  const shortedListTodos = todos.filter((_, i) => ((format === FORMAT.MONTH)
    ? i < 4 : true));

  const isShowDots = (format === FORMAT.MONTH) && todos.length > 4;
  const toFinishCreating = () => setIsCreatingNewTodo(false);

  return (
    <Wrapper ref={todoRef}>
      {shortedListTodos.map((todo, i) => (
        <Todo
          key={todo.todoId}
          todo={todo}
          toFinishCreating={toFinishCreating}
          isNewTodo={isCreatingNewTodo && i === 0}
        />
      ))}

      {isShowDots && <IoEllipsisHorizontal />}
    </Wrapper>
  );
};
