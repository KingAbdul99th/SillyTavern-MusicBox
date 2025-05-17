import { saveSettingsDebounced } from "@ST/script.js";
import { extension_settings } from "@ST/scripts/extensions.js";
import {
  IExtenstionSettings,
  defaultExtensionSettings
} from "./models/ExtensionSettings";

export function getExtensionSettings() {
  // @ts-expect-error global extension settings
  if (!extension_settings[defaultExtensionSettings.name]) {
    // @ts-expect-error global extensions settings
    extension_settings[defaultExtensionSettings.name] =
      defaultExtensionSettings;
  }

  const extensionSettingsGlobal: IExtenstionSettings =
    // @ts-expect-error global extensions settings
    extension_settings[defaultExtensionSettings.name];
  return extensionSettingsGlobal;
}

export function setExtensionSettings(extensionSettings: IExtenstionSettings) {
  // @ts-expect-error global extensions settings
  extension_settings[defaultExtensionSettings.name] = extensionSettings;
  saveSettingsDebounced();
  return extensionSettings
}
