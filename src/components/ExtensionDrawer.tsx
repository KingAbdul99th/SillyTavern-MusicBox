import React, { useEffect, useState } from "react";
import { IExtenstionSettings } from "@/models/ExtensionSettings";
import { DrawerContent } from "@/components/DrawerContent";

interface ExtensionDrawerProps {
  extensionSettings: IExtenstionSettings;
  setExtensionSettings: (newSettings: IExtenstionSettings) => void;
}

function clickHandlerHack() {
  // Sourced from ST-Sorcery
  // @ts-expect-error: Hack to suppress IDE errors due to SillyTavern's
  //             weird mix of imports and globally defined objects.
  const $ = window.$;

  const element = document.querySelector("#extensions-settings-button .drawer-toggle");
  const events = $._data(element, "events");
  const doNavbarIconClick = events.click[0].handler;
  $("#music-box-extension-container .drawer-toggle").on("click", doNavbarIconClick);
}

export const ExtensionDrawer: React.FC<ExtensionDrawerProps> = ({
  extensionSettings,
  setExtensionSettings
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleDrawerOpenClick() {
    setDrawerOpen(!drawerOpen);
  }

  useEffect(() => {
    clickHandlerHack()
  }, []);
  return (
    <>
      <div
        className="drawer-toggle drawer-header"
        data-slide-toggle="hidden"
        onClick={handleDrawerOpenClick}
      >
        <div className="drawer-icon fa-solid fa-music fa-fw closedIcon sttt--enabled interactable"></div>
      </div>
      <div
        className={
          "drawer-content " + (drawerOpen ? "openDrawer" : "closedDrawer")
        }
      >
        <DrawerContent
          extensionSettings={extensionSettings}
          setExtensionSettings={setExtensionSettings}
        ></DrawerContent>
      </div>
    </>
  );
};
