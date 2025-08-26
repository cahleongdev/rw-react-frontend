export type Order = 'asc' | 'desc';

/**
 * Get comparator function for sorting.
 */
export const getComparator = <T>(
  order: Order,
  orderBy: keyof T,
): ((a: T, b: T) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

/**
 * Descending comparator function.
 */
const descendingComparator = <T>(a: T, b: T, orderBy: keyof T): number => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

/**
 * Sort data using the comparator.
 */
export const sortData = <T>(
  array: T[],
  comparator: (a: T, b: T) => number,
): T[] => {
  const stabilizedArray = array.map((el, index) => [el, index] as [T, number]);
  stabilizedArray.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedArray.map((el) => el[0]);
};
