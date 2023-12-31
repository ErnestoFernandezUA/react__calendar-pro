import classNames from 'classnames';
import { IoArrowDownOutline, IoArrowUp } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectOrder,
  selectSortBy,
  sortTable,
} from '../../store/features/controlsWeather/controlsWeatherSlice';
import { Sort } from '../../types/sort';

import './HeadCell.scss';

const headerControls: {
  [ key in Sort ]: { title: string; inverse?: boolean; }
} = {
  [Sort.byNames]: { title: 'City', inverse: true },
  [Sort.byPopulation]: { title: 'Population' },
  [Sort.byMax]: { title: 'Max Temp' },
  [Sort.byMin]: { title: 'Min Temp' },
};

interface HeadCellProps {
  type?: Sort;
  title?: string;
  inverse?: boolean;
  className?: string;
}

export const HeadCell: React.FC<HeadCellProps> = ({
  type,
  title,
  className,
  inverse = false,
}) => {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);
  const order = useAppSelector(selectOrder);
  const onClickSort = () => type && dispatch(sortTable(type));
  const isActive = sortBy === type;
  const direction = inverse ? !order : order;

  return (
    <th
      onClick={onClickSort}
      className={classNames('HeadCell',
        { 'HeadCell--isClickable': type },
        { 'HeadCell--active': isActive },
        className)}
    >
      <div className="HeadCell__content">
        {title || (type && headerControls[type].title)}
        {isActive && (direction ? <IoArrowDownOutline /> : <IoArrowUp />)}
      </div>
    </th>
  );
};
