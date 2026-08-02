import type { IOrder } from "@/modules/orders/entities/order.entity";
import type {
  IOrderAddressNode,
  IOrderLineItemNode,
  IOrderNode,
} from "@/modules/orders/graphql/order.nodes";

export function toAddress(node: IOrderAddressNode) {
  return {
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

export function toLineItem(node: IOrderLineItemNode) {
  return {
    id: node.id,
    title: node.title,
    quantity: node.quantity,
    sku: node.sku ?? node.variant?.sku ?? undefined,
    variantId: node.variant?.id,
    variantTitle: node.variant?.title ?? undefined,
    price: node.variant?.price ?? undefined,
  };
}

export function toOrder(node: IOrderNode): IOrder {
  return {
    id: node.id,
    name: node.name,
    createdAt: node.createdAt ?? undefined,
    updatedAt: node.updatedAt ?? undefined,
    email: node.email ?? undefined,
    tags: node.tags ?? undefined,
    note: node.note ?? undefined,
    financialStatus: node.financialStatus ?? undefined,
    fulfillmentStatus: node.fulfillmentStatus ?? undefined,
    displayFinancialStatus: node.displayFinancialStatus ?? undefined,
    displayFulfillmentStatus: node.displayFulfillmentStatus ?? undefined,
    currencyCode: node.currencyCode ?? undefined,
    totalPrice: node.totalPriceSet?.shopMoney
      ? {
          amount: node.totalPriceSet.shopMoney.amount,
          currencyCode: node.totalPriceSet.shopMoney.currencyCode,
        }
      : undefined,
    subtotalPrice: node.subtotalPriceSet?.shopMoney
      ? {
          amount: node.subtotalPriceSet.shopMoney.amount,
          currencyCode: node.subtotalPriceSet.shopMoney.currencyCode,
        }
      : undefined,
    customer: node.customer
      ? {
          id: node.customer.id,
          firstName: node.customer.firstName ?? undefined,
          lastName: node.customer.lastName ?? undefined,
          email: node.customer.email ?? undefined,
        }
      : undefined,
    lineItems: node.lineItems?.edges.map((e) => toLineItem(e.node)),
    shippingAddress: node.shippingAddress
      ? toAddress(node.shippingAddress)
      : undefined,
    customAttributes: node.customAttributes ?? undefined,
    metafields: node.metafields?.edges.map((e) => e.node),
  };
}
