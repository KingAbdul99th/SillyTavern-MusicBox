import "@/styles/main.scss";
import { logger } from "@/utils/logger";
import { attachReactElement } from "@/components/ExtensionRoot";
import { attachTokenListner } from "@/ExtensionSettings";

function main() {
  logger.info("Initialization Started");
  attachReactElement();
  attachTokenListner();
  logger.info("Initialization Ended");
}

main();
