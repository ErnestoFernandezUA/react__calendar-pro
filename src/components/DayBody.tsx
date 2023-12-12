import {
  FunctionComponent,
  ReactNode,
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

const Wrapper = styled.div<{ format: string }>`
  ${({ format }) => format !== FORMAT.YEAR && css`
    height: 11em;
    overflow: hidden;
  `}

  &:hover {
  }
`;

const DayListTodos = styled.div<{ format?: string }>`
  box-sizing: border-box;
  /* padding: 10px; */
`;

interface DayBodyProps {
  startDay: number;
  todos: TodoType[];
  placeholder: ReactNode;
}

export const DayBody: FunctionComponent<DayBodyProps> = ({
  startDay,
  todos,
  placeholder,
}) => {
  const dispatch = useAppDispatch();
  const format = useAppSelector(selectFormat);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const onDayBodyDoubleClick = (e: React.MouseEvent) => {
    // eslint-disable-next-line no-console
    console.log('onDayBodyDoubleClick = ');

    if (e.target === e.currentTarget) {
      // eslint-disable-next-line no-console
      console.log('onDayBodyDoubleClick = ENT', isCreating);

      dispatch(setSpecialDate(startDay));
      setIsCreating(true);
    }
  };

  return (
    <Wrapper
      onDoubleClick={e => onDayBodyDoubleClick(e)}
      format={format}
    >
      {(format !== FORMAT.YEAR) && (
        <DayListTodos format={format}>
          <TodoList
            todos={todos}
            today={startDay}
            setIsCreating={setIsCreating}
            isCreating={isCreating}
          />
        </DayListTodos>
      )}

      {placeholder}
    </Wrapper>
  );
};
