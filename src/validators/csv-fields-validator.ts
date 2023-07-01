export const validateCSVFields = (fields: string[]) => {
    const requiredFields = ['firstName', 'lastName', 'email'];
  
    for (const field of requiredFields) {
      if (!fields.includes(field)) {
        return false;
      }
    }
  
    return true;
  };