import {
  ChangeEvent,
  FunctionComponent,
  useRef,
} from 'react';
import styled, { css } from 'styled-components';
import {
  IoEllipsisHorizontal,
  // IoClose,
  // IoBuild,
  IoCart,
} from 'react-icons/io5';

import { selectFormat } from '../store/features/interval/intervalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { FORMAT } from '../utils/constants/FORMAT';
import { Todo } from '../types/todo';
import {
  sentTodoToForm,
  // switchPopup,
} from '../store/features/controls/controlsSlice';
// import { POPUP } from '../utils/constants/POPUP';
import { deleteTodo } from '../store/features/todos/todosSlice';
import { Button } from './UI/Button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TodoContainer = styled.div<{ format?: string }>`
  width: 100%;
  line-height: 14px;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;


  & div {
    margin-bottom: 4px;
    /* max-width: 100px; */
  }

  ${({ format }) => (format === FORMAT.YEAR)
  && css`
    display: none;
  `}
`;

const TodoTitle = styled.div<{ color: string, format?: string }>`
  background-color: ${props => props.color};
  color: var(--secondary-text-color);
  padding: 7px 10px;
  border-radius: 8px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  display: flex;
  align-items: center;

  & span {
    ${({ format }) => (format === FORMAT.MONTH || format === FORMAT.WEEK) && css`
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
      white-space: nowrap;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-direction: normal;
      -webkit-box-orient: vertical;
      overflow-wrap: break-word;
    `}
  }
`;

interface TodosProps {
  todos: Todo[];
}

export const Todos: FunctionComponent<TodosProps> = ({ todos }) => {
  const dispatch = useAppDispatch();
  const format = useAppSelector(selectFormat);
  const todoRef = useRef<HTMLDivElement>(null);

  const preparedTodos = todos.filter(
    (_, i) => ((format === FORMAT.MONTH) ? i < 4 : true),
  );

  const isShowDots = (format === FORMAT.MONTH) && todos.length > 4;
  // const onShowFormHandler = (
  //   e: React.MouseEvent<HTMLDivElement>,
  //   todo: Todo,
  // ) => {
  //   // eslint-disable-next-line no-console
  //   console.log('onShowFormHandler');
  //   e.stopPropagation();

  //   dispatch(sentTodoToForm(todo));
  //   dispatch(switchPopup(POPUP.IS_SHOW_FORM));
  // };

  const deleteTodoHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    todoId: string,
  ) => {
    e.stopPropagation();

    dispatch(deleteTodo(todoId));
  };

  const onChangeTodo = (e: ChangeEvent<HTMLInputElement>, todo: Todo) => {
    // eslint-disable-next-line no-console
    console.log(e.target.value);

    dispatch(sentTodoToForm({
      ...todo,
      title: e.target.value,
    }));
  };

  return (
    <Wrapper ref={todoRef}>
      {preparedTodos.map(todo => (
        <TodoContainer
          key={todo.todoId}
          format={format}
        >
          {(format === FORMAT.MONTH || format === FORMAT.WEEK) && (
            <>
              <TodoTitle
                color={todo.color}
                format={format}
                // onClick={(e) => onShowFormHandler(e, todo)}
              >
                {/* <span>{todo.title}</span> */}

                <input
                  type="text"
                  value={todo.title}
                  name={todo.todoId}
                  onChange={e => onChangeTodo(e, todo)}
                />

                <Button
                  type="button"
                  onClick={(e) => deleteTodoHandler(e, todo.todoId)}
                >
                  <IoCart />
                </Button>
              </TodoTitle>
            </>
          )}

          {(format === FORMAT.DAY) && (
            <TodoTitle color={todo.color}>
              {todo.title}
            </TodoTitle>
          )}
        </TodoContainer>
      ))}

      {isShowDots && <IoEllipsisHorizontal />}
    </Wrapper>
  );
};
