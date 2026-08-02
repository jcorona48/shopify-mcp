#!/usr/bin/env node

import "dotenv/config";
import minimist from "minimist";
import { loadConfig, type CliArgs } from "@/shared/config";
import { createApp } from "@/app";

const args = minimist(process.argv.slice(2)) as CliArgs;
const config = loadConfig(process.env, args);

(await createApp(config)).start();
