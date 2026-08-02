export interface ISelectedOption {
  name: string;
  value: string;
}

export interface IProductVariant {
  id: string;
  title: string;
  price: string;
  sku: string;
  options: ISelectedOption[];
  inventoryQuantity?: number;
}

export interface IVariantChangeResult {
  created: IProductVariant[];
  updated: IProductVariant[];
}

export interface IProductWithRemainingVariants {
  id: string;
  title: string;
  remainingVariants: IProductVariant[];
}
