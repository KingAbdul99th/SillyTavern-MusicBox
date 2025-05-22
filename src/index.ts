import "@/styles/main.scss";
import { logger } from "@/utils/logger";
import { attachReactElement } from "@/components/ExtensionRoot";


function main() {
  logger.info("Initialization Started");
  attachReactElement();
  logger.info("Initialization Ended");
}

main();
