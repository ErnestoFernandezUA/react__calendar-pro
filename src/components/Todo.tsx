import {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import {
  IoCart,
} from 'react-icons/io5';

import {
  selectFormat,
} from '../store/features/interval/intervalSlice';

import {
  clearActiveTodo,
  deleteTodo,
  saveTodo,
  selectActiveTodo,
  setActiveTodo,
} from '../store/features/todos/todosSlice';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { FORMAT } from '../utils/constants/FORMAT';
import { TodoType } from '../types/todo';
import { Button } from './UI/Button';
import { FORM_DATA } from '../utils/constants/FORM_DATA';

const Wrapper = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  font-size: 0.8em;
`;

const TodoTitle = styled.div<{ color: string, format?: string }>`
  background-color: ${props => props.color};
  color: var(--primary-text-color);
  display: flex;
  gap: 5px;

  & input {
    width: 100%;
    border: none;
    padding: 0.1em;
    box-sizing: border-box;
  }

  & input:active {
    width: 100%;
    border: none;
    border-bottom: inherit;
  }

  & span {
    ${({ format }) => (format === FORMAT.MONTH || format === FORMAT.WEEK) && css`
      /* overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
      white-space: nowrap;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-direction: normal;
      -webkit-box-orient: vertical;
      overflow-wrap: break-word; */
    `}
  }
`;

const TodoBody = styled.div`
`;

interface TodosProps {
  todo: TodoType;
  toFinishCreating: () => void;
  isNewTodo: boolean;
}

export const Todo: FunctionComponent<TodosProps> = ({
  todo, toFinishCreating, isNewTodo,
}) => {
  const dispatch = useAppDispatch();
  const format = useAppSelector(selectFormat);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<TodoType>(todo);
  const activeTodo = useAppSelector(selectActiveTodo);

  useEffect(() => {
    if (isNewTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNewTodo]);

  const handleDeleteTodo = () => {
    dispatch(deleteTodo(value));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...todo,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputSubmit = () => {
    if (!value.title) {
      return;
    }

    dispatch(saveTodo(value));
    toFinishCreating();
    dispatch(clearActiveTodo());
  };

  const handleInputFocus = () => {
    if (!activeTodo) {
      dispatch(setActiveTodo(todo));
    }
  };

  const handleInputBlur = () => {
    if (activeTodo && activeTodo?.todoId === todo.todoId) {
      handleInputSubmit();
      dispatch(clearActiveTodo());
    }

    if (isNewTodo) {
      toFinishCreating();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // dispatch(saveTodo(value));
      // dispatch(clearActiveTodo());

      handleInputSubmit();

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }, 0);
    }
  };

  const isReadOnly = activeTodo?.todoId !== null
  && activeTodo?.todoId !== todo.todoId;

  return (
    <Wrapper color={todo.color}>
      {(format === FORMAT.MONTH || format === FORMAT.WEEK) && (
        <TodoTitle
          color={todo.color}
          format={format}
        >
          <input
            type="text"
            value={value.title}
            name={FORM_DATA.TITLE}
            ref={inputRef}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            readOnly={isReadOnly}
          />

          <Button
            type="button"
            onClick={handleDeleteTodo}
          >
            <IoCart />
          </Button>
        </TodoTitle>
      )}

      {(format === FORMAT.DAY) && (
        <TodoBody>
          <input
            type="text"
            value={value.description}
            name={FORM_DATA.DESCRIPTION}
            onChange={e => handleInputChange(e)}
          />
        </TodoBody>
      )}
    </Wrapper>
  );
};
