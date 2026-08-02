export interface ICustomerAddressNode {
  id?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  company?: string | null;
  country?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  province?: string | null;
  zip?: string | null;
}

export interface ICustomerOrderNode {
  id: string;
  name: string;
  createdAt?: string | null;
  email?: string | null;
  displayFinancialStatus?: string | null;
  displayFulfillmentStatus?: string | null;
  totalPriceSet?: {
    shopMoney?: { amount: string; currencyCode: string } | null;
  } | null;
}

export interface IMetafieldNode {
  id: string;
  namespace: string;
  key: string;
  value: string;
}

export interface ICustomerAddressConnection {
  edges: Array<{ node: ICustomerAddressNode }>;
}

export interface ICustomerOrderConnection {
  edges: Array<{ node: ICustomerOrderNode }>;
}

export interface IMetafieldConnection {
  edges: Array<{ node: IMetafieldNode }>;
}

export interface ICustomerNode {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  email?: string | null;
  phone?: string | null;
  note?: string | null;
  tags?: string[] | null;
  taxExempt?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  numberOfOrders?: number | null;
  amountSpent?: { amount: string; currencyCode: string } | null;
  defaultAddress?: ICustomerAddressNode | null;
  addresses?: ICustomerAddressConnection;
  metafields?: IMetafieldConnection;
  orders?: ICustomerOrderConnection;
}
