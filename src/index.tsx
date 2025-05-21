/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext } from "@ST/scripts/extensions.js";
import { createRoot } from "react-dom/client";
import React from "react";
import "./styles/main.scss";
import { ExtensionRoot } from "./ExtensionRoot";

declare let toastr: any;
export const globalContext = getContext();

function tryGetCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get("source");
  if (source !== "youtube") {
    return null;
  }
  const query = urlParams.get("query");
  if (query) {
    const params = new URLSearchParams(query);
    const code = params.get("code");
    window.history.replaceState({}, document.title, window.location.pathname);
    globalContext.extensionSettings["Music Box"].code = code;
    return code;
  }
  return null;
}

async function tryGetToken() {
  console.log("[Music Box] Try get token started");
  const settings = globalContext.extensionSettings["Music Box"];
  const code = tryGetCode();

  const url = "https://accounts.google.com/o/oauth2/token";
  const redirectUri = new URL("/callback/youtube", window.location.origin);
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    // @ts-expect-error blah
    body: new URLSearchParams({
      client_id: settings.clientId,
      grant_type: "authorization_code",
      redirect_uri: redirectUri.toString(),
      code
    })
  };

  try {
    const body = await fetch(url, payload);
    const token = await body.json();

    settings.token = token;
    globalContext.saveSettingsDebounced();

    console.log("Spotify token received:", token);
    toastr.success(`Successfully authenticated with Spotify!`);
  } catch (error) {
    console.error("Error during Spotify authentication:", error);
    toastr.error(`Spotify authentication failed. Please try again.`);
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
