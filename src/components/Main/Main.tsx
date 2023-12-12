import {
  selectEndInterval,
  selectFormat,
  selectStartInterval,
} from '../../store/features/interval/intervalSlice';

import { buildInterval } from '../../helpers/buildInterval';
import { FORMAT } from '../../utils/constants/FORMAT';
import { Year } from '../Year';
import { Month } from '../Month';
import { Day } from '../Day';
import { useAppSelector } from '../../store/hooks';

export const Main: React.FC = () => {
  const start = useAppSelector(selectStartInterval);
  const end = useAppSelector(selectEndInterval);
  const interval = buildInterval(start, end);
  const format = useAppSelector(selectFormat);

  return (
    <main>
      {format === FORMAT.YEAR && <Year interval={interval} />}

      {(format === FORMAT.MONTH || format === FORMAT.WEEK)
        && <Month interval={interval} />}

      {format === FORMAT.DAY && <Day startDay={interval[0]} />}
    </main>
  );
};
