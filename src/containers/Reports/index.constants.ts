import { TableField } from './index.types';

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 6;

export const tableFields: TableField[] = [
  { key: 'name', label: 'Report Name', orderable: true },
  { key: 'report', label: 'Report ID', orderable: true },
  { key: 'domain', label: 'Domain', orderable: true },
  { key: 'due_date', label: 'Due Date', orderable: true },
  { key: 'actions', label: 'Actions', orderable: false },
];

export const monthOptions = [
  'All Months',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
