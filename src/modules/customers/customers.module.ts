import type { Tool } from "@/shared/tool";
import type { ICustomerService } from "@/modules/customers/interfaces/customer-service.interface";
import { CustomerService } from "@/modules/customers/services/customer.service";
import { CustomerGraphQLRepository } from "@/modules/customers/repositories/customer-graphql.repository";
import { GetCustomersController } from "@/modules/customers/controllers/get-customers.controller";
import { GetCustomerOrdersController } from "@/modules/customers/controllers/get-customer-orders.controller";
import { UpdateCustomerController } from "@/modules/customers/controllers/update-customer.controller";

export { CustomerService } from "@/modules/customers/services/customer.service";
export { CustomerGraphQLRepository } from "@/modules/customers/repositories/customer-graphql.repository";
export type { ICustomerService } from "@/modules/customers/interfaces/customer-service.interface";
export type { ICustomerRepository } from "@/modules/customers/repositories/customer.repository";

export function createCustomerTools(service: ICustomerService): Tool[] {
  return [
    new GetCustomersController(service),
    new GetCustomerOrdersController(service),
    new UpdateCustomerController(service),
  ];
}
