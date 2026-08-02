/**
 * Shared cross-module value types.
 *
 * Only types reused by more than one module live here. Domain-specific models
 * (Product, Customer, Order, Collection) live in their own `src/modules/<domain>/types.ts`.
 */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Address {
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  province?: string;
  provinceCode?: string;
  zip?: string;
}

export interface Metafield {
  id?: string;
  namespace?: string;
  key?: string;
  value: string;
  type?: string;
}

export interface Seo {
  title?: string | null;
  description?: string | null;
}

export interface CustomAttribute {
  key: string;
  value: string;
}
