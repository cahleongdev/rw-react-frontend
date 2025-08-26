export const schoolTypes = {
  private: 'Private',
  public: 'Public',
  elementary: 'Elementary',
  middle: 'Middle',
  high: 'High',
};

export const downloadTemplateURLs = {
  Schools: '/assets/templates/schoolsTemplate.xlsx',
  Users: '/assets/templates/usersTemplate.xlsx',
  Networks: '/assets/templates/networksTemplate.xlsx',
  'Board Members': '/assets/templates/boardMembersTemplate.xlsx',
};

interface StaticField {
  name: string;
  type: string;
  dataName: string;
  required: boolean;
}

export const STATIC_FIELDS_MAP: Record<string, StaticField[]> = {
  Schools: [
    { name: 'School Name', type: 'string', dataName: 'name', required: true },
    {
      name: 'Street Address',
      type: 'string',
      dataName: 'address',
      required: true,
    },
    { name: 'City', type: 'string', dataName: 'city', required: true },
    { name: 'State', type: 'string', dataName: 'state', required: true },
    { name: 'Zip Code', type: 'string', dataName: 'zipcode', required: true },
    { name: 'County', type: 'string', dataName: 'county', required: false },
    { name: 'District', type: 'string', dataName: 'district', required: false },
    { name: 'Type', type: 'string', dataName: 'type', required: true },
    {
      name: 'Grades Served',
      type: 'string',
      dataName: 'gradeserved',
      required: false,
    },
  ],
  Networks: [
    { name: 'Network Name', type: 'string', dataName: 'name', required: true },
    {
      name: 'Street Address',
      type: 'string',
      dataName: 'address',
      required: true,
    },
    { name: 'City', type: 'string', dataName: 'city', required: true },
    { name: 'State', type: 'string', dataName: 'state', required: true },
    { name: 'Zip Code', type: 'string', dataName: 'zipcode', required: true },
    { name: 'County', type: 'string', dataName: 'county', required: false },
    { name: 'District', type: 'string', dataName: 'district', required: false },
  ],
  Users: [
    {
      name: 'First Name',
      type: 'string',
      dataName: 'first_name',
      required: true,
    },
    {
      name: 'Last Name',
      type: 'string',
      dataName: 'last_name',
      required: true,
    },
    { name: 'Email', type: 'string', dataName: 'email', required: true },
    // { name: 'Role', type: 'string', dataName: 'role', required: true },
    {
      name: 'Phone Number',
      type: 'string',
      dataName: 'phone_number',
      required: false,
    },
    { name: 'Title', type: 'string', dataName: 'title', required: false },
  ],
  'Board Members': [
    {
      name: 'First Name',
      type: 'string',
      dataName: 'first_name',
      required: true,
    },
    {
      name: 'Last Name',
      type: 'string',
      dataName: 'last_name',
      required: true,
    },
    { name: 'Email', type: 'string', dataName: 'email', required: true },
    {
      name: 'Phone Number',
      type: 'string',
      dataName: 'phone',
      required: false,
    },
    { name: 'Title', type: 'string', dataName: 'title', required: false },
    {
      name: 'Start Term',
      type: 'string',
      dataName: 'start_term',
      required: true,
    },
    { name: 'End Term', type: 'string', dataName: 'end_term', required: true },
  ],
};

export const dateFields = ['Start Term', 'End Term'];
