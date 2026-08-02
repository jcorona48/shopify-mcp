import type { UserError } from "@/shared/errors";
import type { ICustomerNode } from "@/modules/customers/graphql/customer.nodes";

export interface ICustomerConnection {
  edges: Array<{ node: ICustomerNode }>;
}

export interface ICustomerMutationPayload {
  customer?: ICustomerNode | null;
  userErrors: UserError[];
}

export interface IListCustomersResponse {
  customers: ICustomerConnection;
}

export interface IGetCustomerOrdersResponse {
  customer?: ICustomerNode | null;
}

export interface IUpdateCustomerResponse {
  customerUpdate?: ICustomerMutationPayload | null;
}
