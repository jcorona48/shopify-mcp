import type { ICustomerService } from "@/modules/customers/interfaces/customer-service.interface";
import type { Tool } from "@/shared/tool";
import { UpdateCustomerInputSchema } from "@/modules/customers/dto/update-customer.dto";
import type { UpdateCustomerInput } from "@/modules/customers/dto/update-customer.dto";

export class UpdateCustomerController implements Tool {
  readonly name = "update-customer";
  readonly description =
    "Update an existing customer's attributes (name, email, tags, note, tax exemption)";
  readonly inputSchema = UpdateCustomerInputSchema;

  constructor(private readonly service: ICustomerService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    return this.service.updateCustomer(input as UpdateCustomerInput);
  }
}
