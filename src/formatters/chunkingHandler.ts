export const chunkArray = (array: any[], maxLength: number) => {
  const chunkSize = Math.floor(maxLength / array.length);
  return {
    chunks: array.slice(0, chunkSize),
    metadata: { total: array.length, showing: `1-${chunkSize}` }
  };
};