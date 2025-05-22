import { createRoot } from "react-dom/client";
import { ExtensionDrawer } from "@/components/ExtensionDrawer"
import { getSTExtensionSettings, setSTExtensionSettings } from "../ExtensionSettings";
import { useEffect, useState } from "react";
import React from "react";

export function attachReactElement() {
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

const ExtensionRoot = () => {
  const [extensionSettings, setExtensionSettings] = useState(getSTExtensionSettings());

  useEffect(() => {
    setSTExtensionSettings(extensionSettings)
  }, [extensionSettings]);

    return (
        <ExtensionDrawer extensionSettings={extensionSettings} setExtensionSettings={setExtensionSettings}/>
    )
}