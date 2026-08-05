import { createApp } from "@/app";
import { loadConfig } from "@/shared/config";

const server = createApp(loadConfig(process.env), { host: "0.0.0.0" });

export default server.app;
