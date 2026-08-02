import type {
  ICustomer,
  ICustomerAddress,
  ICustomerOrder,
} from "@/modules/customers/entities/customer.entity";
import type {
  ICustomerAddressNode,
  ICustomerNode,
  ICustomerOrderNode,
} from "@/modules/customers/graphql/customer.nodes";

export function toCustomer(node: ICustomerNode): ICustomer {
  return {
    id: node.id,
    firstName: node.firstName ?? undefined,
    lastName: node.lastName ?? undefined,
    email: node.email ?? undefined,
    phone: node.phone ?? undefined,
    displayName: node.displayName ?? undefined,
    note: node.note ?? undefined,
    tags: node.tags ?? undefined,
    taxExempt: node.taxExempt ?? undefined,
    createdAt: node.createdAt ?? undefined,
    updatedAt: node.updatedAt ?? undefined,
    numberOfOrders: node.numberOfOrders ?? undefined,
    amountSpent: node.amountSpent
      ? {
          amount: node.amountSpent.amount,
          currencyCode: node.amountSpent.currencyCode,
        }
      : undefined,
    defaultAddress: node.defaultAddress
      ? toAddress(node.defaultAddress)
      : undefined,
    addresses: node.addresses?.edges.map((e) => toAddress(e.node)),
    metafields: node.metafields?.edges.map((e) => e.node),
  };
}

export function toAddress(node: ICustomerAddressNode): ICustomerAddress {
  return {
    id: node.id ?? undefined,
    address1: node.address1 ?? undefined,
    address2: node.address2 ?? undefined,
    city: node.city ?? undefined,
    company: node.company ?? undefined,
    country: node.country ?? undefined,
    firstName: node.firstName ?? undefined,
    lastName: node.lastName ?? undefined,
    phone: node.phone ?? undefined,
    province: node.province ?? undefined,
    zip: node.zip ?? undefined,
  };
}

export function toCustomerOrder(node: ICustomerOrderNode): ICustomerOrder {
  return {
    id: node.id,
    name: node.name,
    createdAt: node.createdAt ?? undefined,
    email: node.email ?? undefined,
    displayFinancialStatus: node.displayFinancialStatus ?? undefined,
    displayFulfillmentStatus: node.displayFulfillmentStatus ?? undefined,
    totalPrice: node.totalPriceSet?.shopMoney
      ? {
          amount: node.totalPriceSet.shopMoney.amount,
          currencyCode: node.totalPriceSet.shopMoney.currencyCode,
        }
      : undefined,
  };
}
