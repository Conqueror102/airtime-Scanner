// Define the application types
export interface VoucherData {
  pin: string;
  ussdCode?: string;
}

export const formatUSSDCode = (pin: string): string => {
  return `*311*${pin}#`;
};