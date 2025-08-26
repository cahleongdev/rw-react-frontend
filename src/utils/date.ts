import * as XLSX from 'xlsx';

export const getDateFromString = (str: string) =>
  new Date(
    Number(str.substring(0, 4)),
    Number(str.substring(5, 7)) - 1,
    Number(str.substring(8, 10)),
  );

/**
 * Convert an Excel date code to an ISO date string
 * @param serial - The Excel date code
 * @returns The date in ISO format
 */
export const excelDateToISO = (serial: number): string => {
  const date = XLSX.SSF.parse_date_code(serial);
  if (!date) return serial.toString();
  // Format as 'YYYY-MM-DD'
  const mm = String(date.m).padStart(2, '0');
  const dd = String(date.d).padStart(2, '0');
  return `${date.y}-${mm}-${dd}`;
};
