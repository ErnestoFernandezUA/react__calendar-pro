import { TIME_TO_LIVE } from './constants/TIME_TO_LIVE';

export const isExpired = (timer?: string) => {
  if (!timer) {
    return true;
  }

  return Date.now() - Number(timer) > TIME_TO_LIVE;
};
