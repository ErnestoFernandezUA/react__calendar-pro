import styled from 'styled-components';
import { IoEllipsisHorizontal } from 'react-icons/io5';

import { selectFormat } from '../store/features/interval/intervalSlice';
import { useAppSelector } from '../store/hooks';
import { FORMAT } from '../utils/constants/FORMAT';
import { TodoType } from '../types/todo';
import { Todo } from './Todo';
import { DraggableHOC } from './DragHOC/DraggableHOC';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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
  const maxVisibleTodos = 6;

  const format = useAppSelector(selectFormat);
  const shortedListTodos = todos;
  const isShowDots = (format === FORMAT.MONTH)
    && todos.length > maxVisibleTodos;

  const newTodo = {
    todoId: `${new Date().valueOf()}`,
    title: '',
    description: '',
    date: today,
    color: '',
  };

  return (
    <Wrapper>
      {shortedListTodos.map((todo, index) => (
        <DraggableHOC
          draggableId={todo.todoId}
          index={index}
          key={todo.todoId}
        >
          <Todo todo={todo} setIsCreating={setIsCreating} />
        </DraggableHOC>
      ))}

      {isCreating && (<Todo todo={newTodo} setIsCreating={setIsCreating} />)}
      {isShowDots && <IoEllipsisHorizontal />}
    </Wrapper>
  );
};
