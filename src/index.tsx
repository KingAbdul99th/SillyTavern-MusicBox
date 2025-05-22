import { createRoot } from "react-dom/client";
import React from "react";
import "./styles/main.scss";
import { ExtensionRoot } from "./ExtensionRoot";
import { logger } from "./utils/logger";

function attachReactElement() {
  const rootContainer = document.getElementById("top-settings-holder");

  if (rootContainer) {
    const rootElement = document.createElement("div");
    rootContainer.appendChild(rootElement);
    rootElement.className = "drawer";
    rootElement.id = "music-box-extension-container";
    const root = createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <ExtensionRoot></ExtensionRoot>
      </React.StrictMode>
    );
  }
}

function main() {
  logger.info("Initialization Started");
  attachReactElement();
  logger.info("Initialization Ended");
}

main();
