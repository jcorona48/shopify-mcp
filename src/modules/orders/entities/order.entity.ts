export interface IOrderLineItem {
  id: string;
  title: string;
  quantity: number;
  sku?: string;
  variantId?: string;
  variantTitle?: string;
  price?: string;
}

export interface IOrderAddress {
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

export interface IOrder {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  tags?: string[];
  note?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  displayFinancialStatus?: string;
  displayFulfillmentStatus?: string;
  totalPrice?: { amount: string; currencyCode: string };
  subtotalPrice?: { amount: string; currencyCode: string };
  currencyCode?: string;
  customer?: { id: string; firstName?: string; lastName?: string; email?: string };
  lineItems?: IOrderLineItem[];
  shippingAddress?: IOrderAddress;
  customAttributes?: Array<{ key: string; value: string }>;
  metafields?: Array<{ id: string; namespace: string; key: string; value: string }>;
}
