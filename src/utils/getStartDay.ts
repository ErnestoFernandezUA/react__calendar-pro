export const getStartDay = (value: number) => {
  const date = new Date(+value);

  return String(new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
  ).valueOf());
};
