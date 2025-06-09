export interface Stock {
  id?: number;                     // Optional (backend auto-genererer ved POST)
  category: string;
  subCategory: string;
  name: string;
  dateOfExpiry: string;           //  ændret fra Date til string (ISO string format)
  volumePerUnit: number;
  numberOfUnits: number;
  status: string;
  barCodeString: string;
}
