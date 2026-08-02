export interface ICustomerAddress {
  id?: string;
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  province?: string;
  zip?: string;
}

export interface ICustomer {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  displayName?: string;
  note?: string;
  tags?: string[];
  taxExempt?: boolean;
  createdAt?: string;
  updatedAt?: string;
  numberOfOrders?: number;
  amountSpent?: { amount: string; currencyCode: string };
  defaultAddress?: ICustomerAddress;
  addresses?: ICustomerAddress[];
  metafields?: Array<{ id: string; namespace: string; key: string; value: string }>;
}

export interface ICustomerOrder {
  id: string;
  name: string;
  createdAt?: string;
  email?: string;
  displayFinancialStatus?: string;
  displayFulfillmentStatus?: string;
  totalPrice?: { amount: string; currencyCode: string };
}
