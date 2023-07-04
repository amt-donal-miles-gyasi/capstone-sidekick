/**
 * Validates the fields of the CSV file.
 *
 * @param {string[]} fields - The array of CSV fields.
 * @returns {boolean} - A boolean indicating if the CSV fields are valid or not.
 */

export const validateCSVFields = (fields: string[]): boolean => {
  const requiredFields = ['firstName', 'lastName', 'email'];

  for (const field of requiredFields) {
    if (!fields.includes(field)) {
      return false;
    }
  }

  return true;
};
