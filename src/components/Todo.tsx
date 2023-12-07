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
  selectCurrentDate,
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
  width: 100%;
`;

const TodoTitle = styled.div<{ color: string, format?: string }>`
  background-color: ${props => props.color};
  color: var(--primary-text-color);
  display: flex;
  justify-content: space-between;
  width: 100%;

  & input {
    width: 100%;
    border: none;
    /* padding: 0.1em; */
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
  setIsCreating: (value: boolean) => void;
  // isCreating: boolean;
}

export const Todo: FunctionComponent<TodosProps> = ({
  todo,
  setIsCreating,
  // isCreating,
}) => {
  const dispatch = useAppDispatch();
  const format = useAppSelector(selectFormat);
  const activeTodo = useAppSelector(selectActiveTodo);
  const currentDate = useAppSelector(selectCurrentDate);
  const isNewTodo = !todo.title; /// isCreating - don't work correctly

  const initialTodo: TodoType = {
    todoId: `${new Date().valueOf()}`,
    title: '',
    description: '',
    date: currentDate,
    color: '',
  };
  const [value, setValue] = useState<TodoType>(todo || initialTodo);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isNewTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNewTodo]);

  const handleDeleteTodo = () => {
    if (!value) {
      return;
    }

    dispatch(deleteTodo(value));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputSubmit = () => {
    if (!value?.title) {
      return;
    }

    dispatch(saveTodo(value));
  };

  const handleInputFocus = () => {
    if (!activeTodo && todo) {
      setValue(todo);
      dispatch(setActiveTodo(todo));
    }
  };

  const handleInputBlur = () => {
    handleInputSubmit();
    dispatch(clearActiveTodo());
    setIsCreating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }, 0);
    }
  };

  return (
    <Wrapper color={value.color}>
      {(format === FORMAT.MONTH || format === FORMAT.WEEK) && (
        <TodoTitle
          color={value.color}
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
