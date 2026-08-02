export interface IOrderCustomerNode {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export interface IOrderLineItemNode {
  id: string;
  title: string;
  quantity: number;
  sku?: string | null;
  variant?: {
    id: string;
    title?: string | null;
    sku?: string | null;
    price?: string | null;
  } | null;
}

export interface IOrderAddressNode {
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

export interface IOrderNode {
  id: string;
  name: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  email?: string | null;
  tags?: string[] | null;
  note?: string | null;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  displayFinancialStatus?: string | null;
  displayFulfillmentStatus?: string | null;
  currencyCode?: string | null;
  totalPriceSet?: {
    shopMoney?: { amount: string; currencyCode: string } | null;
  } | null;
  subtotalPriceSet?: {
    shopMoney?: { amount: string; currencyCode: string } | null;
  } | null;
  customer?: IOrderCustomerNode | null;
  lineItems?: { edges: Array<{ node: IOrderLineItemNode }> };
  shippingAddress?: IOrderAddressNode | null;
  customAttributes?: Array<{ key: string; value: string }>;
  metafields?: {
    edges: Array<{ node: { id: string; namespace: string; key: string; value: string } }>;
  };
}
