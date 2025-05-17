/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext } from "@ST/scripts/extensions.js";
import { createRoot } from "react-dom/client";
import React from "react";
import "./styles/main.scss";
import { ExtensionRoot } from "./ExtensionRoot";

// declare var SillyTavern: any;
export const globalContext = getContext();

function attachReactElement() {  
  // Choose the root container for the extension's main UI
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
  console.log("[music-box] Initialization Started");
  attachReactElement();
  console.log("[music-box] Initialization Finished");
}

main();
