import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import {
  selectCurrentDate,
  selectEndInterval,
  selectFormat,
  selectStartInterval,
} from '../../store/features/interval/intervalSlice';

import { buildInterval } from '../../helpers/buildInterval';
import { FORMAT } from '../../utils/constants/FORMAT';
import { Year } from '../Year';
import { Month } from '../Month';
import { Day } from '../Day';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { moveTodo } from '../../store/features/todos/todosSlice';

export const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const start = useAppSelector(selectStartInterval);
  const end = useAppSelector(selectEndInterval);
  const interval = buildInterval(start, end);
  const format = useAppSelector(selectFormat);
  const current = useAppSelector(selectCurrentDate);

  const handleOnDragEnd = (results: DropResult) => {
    // eslint-disable-next-line no-console
    console.log('Main: handleOnDragEnd', results);

    const { destination, source } = results;

    // eslint-disable-next-line no-console
    console.log(results);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return;
    }

    dispatch(moveTodo({ destination, source }));
  };

  return (
    <main>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {format === FORMAT.YEAR && <Year interval={interval} />}

        {(format === FORMAT.MONTH || format === FORMAT.WEEK)
          && <Month interval={interval} />}

        {format === FORMAT.DAY && <Day startDay={current || interval[0]} />}
      </DragDropContext>
    </main>
  );
};
