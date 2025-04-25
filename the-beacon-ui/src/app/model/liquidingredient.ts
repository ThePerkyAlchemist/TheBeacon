export interface LiquidIngredient {
    id?: number;
    category: string;
    subcategory: string;
    name: string;
    dateOfExpiry: Date;
    volumePerUnit: number;
    numberOfUnits: number;
    status: string;
    barcodeString: string;
  }