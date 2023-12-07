import styled from 'styled-components';
import {
  IoEllipsisHorizontal,
} from 'react-icons/io5';

import { selectFormat } from '../store/features/interval/intervalSlice';
import { useAppSelector } from '../store/hooks';
import { FORMAT } from '../utils/constants/FORMAT';
import { TodoType } from '../types/todo';
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
  today: number;
  setIsCreating: (value: boolean) => void;
  isCreating: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  today,
  setIsCreating,
  isCreating,
}) => {
  const format = useAppSelector(selectFormat);
  const shortedListTodos = todos.filter((_, i) => ((format === FORMAT.MONTH)
    ? i < 4 : true));
  const isShowDots = (format === FORMAT.MONTH) && todos.length > 6;

  const newTodo = {
    todoId: `${new Date().valueOf()}`,
    title: '',
    description: '',
    date: today,
    color: '',
  };

  return (
    <Wrapper>
      {shortedListTodos.map((todo) => (
        <Todo
          key={todo.todoId}
          todo={todo}
          setIsCreating={setIsCreating}
          // isCreating={isCreating}
        />
      ))}

      {isCreating && (
        <Todo
          todo={newTodo}
          setIsCreating={setIsCreating}
          // isCreating={isCreating}
        />
      )}

      {isShowDots && <IoEllipsisHorizontal />}
    </Wrapper>
  );
};
