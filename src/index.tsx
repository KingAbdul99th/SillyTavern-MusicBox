/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext } from "@ST/scripts/extensions.js";
import { createRoot } from "react-dom/client";
import React from "react";
import "./styles/main.scss";
import { ExtensionRoot } from "./ExtensionRoot";

export const globalContext = getContext();

function tryGetToken() {
  console.log("[Music box] tryGetToken")
  const urlParams = new URLSearchParams(window.location.href);
  const source = urlParams.get("source");
  if (source !== "youtube") {
    return null;
  }
  console.log("[Music Box] urlParams = ", urlParams);
  const access_token = urlParams.get("access_token");
  if (access_token) {
    globalContext.extensionSettings["Music Box"].token = access_token;
    globalContext.saveSettingsDebounced();
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function attachTokenListner() {
  globalContext.eventSource.on(globalContext.event_types.APP_READY, tryGetToken);
}

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
  attachTokenListner();
  console.log("[music-box] Initialization Finished");
}

main();
