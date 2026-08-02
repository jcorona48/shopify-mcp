import type { UpdateCustomerInput } from "@/modules/customers/dto/update-customer.dto";
import type {
  ICustomer,
  ICustomerOrder,
} from "@/modules/customers/entities/customer.entity";

export interface IListCustomersParams {
  searchQuery?: string;
  limit: number;
}

export interface IGetCustomerOrdersParams {
  customerId: string;
  limit: number;
}

export interface ICustomersResponse {
  customers: ICustomer[];
}

export interface ICustomerOrdersResponse {
  customer: ICustomer;
  orders: ICustomerOrder[];
}

export interface ICustomerResponse {
  customer: ICustomer;
}

export interface ICustomerService {
  listCustomers(params: IListCustomersParams): Promise<ICustomersResponse>;
  getCustomerOrders(
    params: IGetCustomerOrdersParams,
  ): Promise<ICustomerOrdersResponse>;
  updateCustomer(input: UpdateCustomerInput): Promise<ICustomerResponse>;
}
