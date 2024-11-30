// Utility to manage invoice numbers
export const getNextInvoiceNumber = (prefix: string, lastNumber: number): string => {
  const nextNumber = lastNumber + 1;
  const paddedNumber = nextNumber.toString().padStart(6, '0');
  return `${prefix}${paddedNumber}`;
};