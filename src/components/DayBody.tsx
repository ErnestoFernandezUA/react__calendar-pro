import {
  FunctionComponent,
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
    /* scroll: auto; */
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
}

export const DayBody: FunctionComponent<DayBodyProps> = ({
  startDay,
  todos,
}) => {
  const dispatch = useAppDispatch();
  const format = useAppSelector(selectFormat);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const onDayBodyClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(setSpecialDate(startDay));
      setIsCreating(true);
    }
  };

  return (
    <Wrapper
      onClick={e => onDayBodyClick(e)}
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
    </Wrapper>
  );
};
