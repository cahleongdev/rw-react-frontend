import { TableField } from './index.types';

export const STORAGE_PATH = 'https://reportwell-files.s3.amazonaws.com/';

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 6;

export const tableFields: TableField[] = [
  { key: 'name', label: 'School Name', orderable: true },
  { key: 'city', label: 'City', orderable: true },
  { key: 'grades', label: 'Grades Served', orderable: true },
  { key: 'admin', label: 'Admin Name', orderable: false },
  { key: 'status', label: 'Status', orderable: false },
  { key: 'actions', label: 'Actions', orderable: false },
];

export const TAB_LABELS: string[] = ['Profile', 'Users', 'Notifications'];

export const schoolTypes = {
  private: 'Private',
  public: 'Public',
  elementary: 'Elementary',
  middle: 'Middle',
  high: 'High',
};

export const itemsPerPageOptions = [6, 12, 18];

export const integrations = [
  {
    name: 'Google Calendar',
    logo: 'https://google.com/favicon.ico',
    link: 'https://calendar.google.com',
    description:
      'Lorem ipsum dolor sit amet consectetur. Semper condimentum sed faucibus suspendisse turpis ut.',
    status: 'Active',
  },
  {
    name: 'Microsoft Exchange',
    logo: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Exchange_80px_RE2mzwk?resMode=sharp2&op_usm=1.5,0.65,15,0&wid=40&hei=40&qlt=100&fmt=png-alpha&fit=constrain',
    link: 'https://learn.microsoft.com',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    status: 'Inactive',
  },
  {
    name: 'Slack',
    logo: 'https://a.slack-edge.com/cebaa/img/ico/favicon.ico',
    link: 'https://slack.com',
    description:
      'Lorem ipsum dolor sit amet consectetur. Elementum convallis vitae varius ut dignissim  Semper condimentum sed faucibus.',
    status: 'Connection Failed',
  },
  {
    name: 'Integration',
    logo: '/assets/images/logos/reportwell.svg',
    link: 'https://slack.com',
    description:
      'Lorem ipsum dolor sit amet consectetur. Elementum convallis vitae varius ut dignissim  Semper condimentum sed faucibus.',
    status: 'Authentication Required',
  },
  {
    name: 'Integration',
    logo: '/assets/images/logos/reportwell.svg',
    link: 'https://integration.com',
    description:
      'Lorem ipsum dolor sit amet consectetur. Elementum convallis vitae varius ut dignissim  Semper condimentum sed faucibus.',
    status: 'Error',
  },
  {
    name: 'Integration',
    logo: '/assets/images/logos/reportwell.svg',
    link: 'https://integration.com',
    description:
      'Lorem ipsum dolor sit amet consectetur. Elementum convallis vitae varius ut dignissim  Semper condimentum sed faucibus.',
    status: '',
  },
];
