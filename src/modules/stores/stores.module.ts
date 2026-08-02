import type { Tool } from "@/shared/tool";
import type { StoreResolver } from "@/shared/store/store-resolver";
import { ConnectShopController } from "@/modules/stores/controllers/connect-shop.controller";

export function createStoreTools(
  resolver: StoreResolver,
  sessionId: string | null,
): Tool[] {
  return [new ConnectShopController(resolver, sessionId)];
}
