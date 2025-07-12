export const validateArray = (data: any) => {
  if (!Array.isArray(data)) throw new Error('Data must be an array');
};