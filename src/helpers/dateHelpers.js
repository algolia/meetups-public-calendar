import dayjs from 'dayjs';

/**
 * Get display date from URL params or current date
 * @param {string|undefined} year - Year from URL params
 * @param {string|undefined} month - Month from URL params
 * @returns {{year: number, month: number}} Display date with year and month
 */
export const getDisplayDate = (year, month) => {
  // If both params exist, use them
  if (year && month) {
    return {
      year: parseInt(year),
      month: parseInt(month),
    };
  }

  // Otherwise use current date
  const now = dayjs();
  return {
    year: now.year(),
    month: now.month() + 1, // month() returns 0-11, we need 1-12
  };
};
