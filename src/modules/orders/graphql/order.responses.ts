import type { UserError } from "@/shared/errors";
import type { IOrderNode } from "@/modules/orders/graphql/order.nodes";

export interface IOrderConnection {
  edges: Array<{ node: IOrderNode }>;
}

export interface IOrderMutationPayload {
  order?: IOrderNode | null;
  userErrors: UserError[];
}

export interface IListOrdersResponse {
  orders: IOrderConnection;
}

export interface IGetOrderByIdResponse {
  order?: IOrderNode | null;
}

export interface IUpdateOrderResponse {
  orderUpdate?: IOrderMutationPayload | null;
}
