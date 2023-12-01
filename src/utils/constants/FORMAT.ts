import { FormatKeys, FormatValue } from '../../types/format';

export const FORMAT: { [key in FormatKeys]: FormatValue } = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};
