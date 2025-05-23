import { CONSTS } from "@/utils/consts";

export const logger = {
  error: (...messages: unknown[]) =>
    console.log(CONSTS.extensionName, " ", "[ERROR]", ...messages),
  debug: (...messages: unknown[]) =>
    console.log(CONSTS.extensionName, " ", "[DEBUG]", ...messages),
  info: (...messages: unknown[]) =>
    console.log(CONSTS.extensionName, " ", "[INFO]", ...messages)
};
