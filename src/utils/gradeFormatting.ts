export interface GradeOption {
  value: string;
  label: string;
}

const defaultGradeSortOrder: { [key: string]: number } = {
  K: 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  '11': 11,
  '12': 12,
};

export const formatGradeRange = (
  grades: string[],
  gradeOptions?: GradeOption[],
  sortOrder: { [key: string]: number } = defaultGradeSortOrder,
): string => {
  if (!grades || grades.length === 0) {
    return 'N/A'; // Or 'Select grades...' depending on context, can be customized by caller if needed
  }

  const sortedGrades = [...grades].sort((a, b) => {
    const aOrder = sortOrder[a] ?? parseInt(a, 10); // Fallback for numeric grades not in sortOrder
    const bOrder = sortOrder[b] ?? parseInt(b, 10); // Fallback for numeric grades not in sortOrder
    return aOrder - bOrder;
  });

  const getLabel = (gradeValue: string): string => {
    if (gradeOptions) {
      const option = gradeOptions.find((opt) => opt.value === gradeValue);
      return option ? option.label : gradeValue;
    }
    return gradeValue;
  };

  if (sortedGrades.length === 1) {
    return getLabel(sortedGrades[0]);
  }

  const lowestGrade = getLabel(sortedGrades[0]);
  const highestGrade = getLabel(sortedGrades[sortedGrades.length - 1]);

  return `${lowestGrade} - ${highestGrade}`;
};
