export interface IProductOptionValue {
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface IProductOption {
  id: string;
  name: string;
  position?: number;
  values: IProductOptionValue[];
}
