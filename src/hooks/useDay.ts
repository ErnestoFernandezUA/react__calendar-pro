import { WEEK } from '../utils/constants/WEEK';

const isLastDayOfMonth = (date: Date) => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return date.getDate() === lastDay.getDate();
};

const isFirstDayOfMonth = (date: Date) => {
  return date.getDate() === 1;
};

export const useDay = (value: number) => {
  const date = new Date(value);
  const day = date.getDate();
  const arr = date.toDateString().split(' ');
  const dayOfWeek = arr[0];
  const month = arr[1];

  const year = date.getFullYear();
  const fullNameDayOfWeek = WEEK[date.getDay()];
  const stringDate = date.toDateString();

  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const weekOfYear = Math.ceil((((date.getTime() - firstDayOfYear.getTime())
   / 86400000) + firstDayOfYear.getDay() + 1) / 7);

  return {
    dayOfWeek,
    month,
    day,
    year,
    fullNameDayOfWeek,
    isLastDayOfMonth: isLastDayOfMonth(date),
    isFirstDayOfMonth: isFirstDayOfMonth(date),
    stringDate,
    weekOfYear,
  };
};
