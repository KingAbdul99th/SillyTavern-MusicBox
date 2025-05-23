import React, { useState } from "react";
import { IExtenstionSettings } from "@/models/ExtensionSettings";
import { DrawerContent } from "@/components/DrawerContent";

interface ExtensionDrawerProps {
  extensionSettings: IExtenstionSettings;
  setExtensionSettings: (newSettings: IExtenstionSettings) => void;
}

export const ExtensionDrawer: React.FC<ExtensionDrawerProps> = ({
  extensionSettings,
  setExtensionSettings
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleDrawerOpenClick() {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <>
      <div
        className="drawer-toggle drawer-header"
        onClick={handleDrawerOpenClick}
      >
        <div className="drawer-icon fa-solid fa-music fa-fw closedIcon sttt--enabled interactable"></div>
      </div>
      <div
        className={
          "drawer-content " + (drawerOpen ? "openDrawer" : "closedDrawer")
        }
        style={{ display: drawerOpen ? "block" : "none" }}
      >
        <DrawerContent
          extensionSettings={extensionSettings}
          setExtensionSettings={setExtensionSettings}
        ></DrawerContent>
      </div>
    </>
  );
};
