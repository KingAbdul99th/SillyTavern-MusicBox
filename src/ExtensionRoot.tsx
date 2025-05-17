import { SettingsDrawer } from "./SettingsDrawer"
import { getSTExtensionSettings, setSTExtensionSettings } from "./ExtensionSettings";
import { useEffect, useState } from "react";


export const ExtensionRoot = () => {
  const [extensionSettings, setExtensionSettings] = useState(getSTExtensionSettings());

  useEffect(() => {
    setSTExtensionSettings(extensionSettings)
  }, [extensionSettings]);

    return (
        <SettingsDrawer extensionSettings={extensionSettings} setExtensionSettings={setExtensionSettings}/>
    )
}