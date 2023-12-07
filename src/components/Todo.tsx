import {
  ChangeEvent,
  // Dispatch,
  FunctionComponent,
  // RefObject,
  // SetStateAction,
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
import { useDay } from '../hooks/useDay';

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
  // isNewTodo?: boolean;
  // todosLength?: number;
  today: number;

  // setActiveInputRef:
  // Dispatch<SetStateAction<RefObject<HTMLInputElement> | null>>;
  // activeInputRef?: React.RefObject<HTMLInputElement> | null;
  setIsCreating: (value: boolean) => void;
}

export const Todo: FunctionComponent<TodosProps> = ({
  todo,
  // isNewTodo,
  // todosLength,
  today,

  // setActiveInputRef,
  // activeInputRef,
  setIsCreating,
}) => {
  const dispatch = useAppDispatch();
  const format = useAppSelector(selectFormat);
  const activeTodo = useAppSelector(selectActiveTodo);
  const currentDate = useAppSelector(selectCurrentDate);
  const isNewTodo = !todo?.title;

  const initialTodo: TodoType = {
    todoId: `${new Date().valueOf()}`,
    title: '',
    description: '',
    date: currentDate,
    color: '',
  };
  const [value, setValue] = useState<TodoType>(todo || initialTodo);
  // const isReadOnly = activeTodo?.todoId !== null
  // && activeTodo?.todoId !== value.todoId;

  const { day } = useDay(today);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // eslint-disable-next-line no-console
  // console.log(isNewTodo);

  useEffect(() => {
    if (isNewTodo && inputRef.current) {
      // eslint-disable-next-line no-console
      console.log('focus');

      inputRef.current.focus();
    }
  }, [isNewTodo]);

  // useEffect(() => {
  //   if (isNewTodo) {
  //     // eslint-disable-next-line no-console
  //     console.log('isNewTodo setActiveInputRef(inputRef);');

  //     // setActiveInputRef(inputRef);
  //     // inputRef.current?.focus();
  //   }
  // }, [setActiveInputRef]);

  // useEffect(() => {
  //   const inputElement: HTMLInputElement | null
  //    = document.querySelector(`.inputForFocus-${day}`);

  //   // eslint-disable-next-line no-console
  //   console.log('useEffect ref', day, inputElement, isNewTodo, todosLength);

  //   if (inputElement) {
  //     inputElement.focus();

  //     // eslint-disable-next-line no-console
  //     console.log('useEffect ref - FOCUS', day, inputElement.value);
  //   }
  // }, []);

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
      // eslint-disable-next-line no-console
      console.log('handleSubmit NOT save todo');

      return;
    }

    // eslint-disable-next-line no-console
    console.log('handleSubmit save todo', value);

    dispatch(saveTodo(value));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault(); // Предотвращаем дальнейшее всплытие
    e.stopPropagation();

    // eslint-disable-next-line no-console
    console.log('handleInputFocus', 'isNewTodo', isNewTodo, todo);

    if (!activeTodo && todo) {
      // eslint-disable-next-line no-console
      console.log('handleInputFocus setActiveTodo', value);

      setValue(todo);
      dispatch(setActiveTodo(todo));
      // setActiveInputRef(inputRef);
    }
  };

  const handleInputBlur = () => {
    // eslint-disable-next-line no-console
    console.log('handleInputBlur');

    handleInputSubmit();
    dispatch(clearActiveTodo());
    // setValue(initialTodo);

    // if (setActiveInputRef && isNewTodo) {
    //   setActiveInputRef(null);
    // }

    setIsCreating(false);
    // if (setIsCreating) {
    // }
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

  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('render after mount');

  //   return () => {
  //     // eslint-disable-next-line no-console
  //     console.log('render before unmount');
  //   };
  // }, []);

  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('render');
  // });

  // eslint-disable-next-line no-console
  // console.log('render without useEffect');

  // const handleTodoTitleClick = () => {
  //   // eslint-disable-next-line no-console
  //   console.log('handleTodoTitleClick');
  //   setActiveInputRef(inputRef);
  // };

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
            onFocus={e => handleInputFocus(e)}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            // readOnly={isReadOnly}
            className={`inputForFocus-${day}`}
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
