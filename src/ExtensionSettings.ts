import { saveSettingsDebounced } from "@ST/script.js";
import { extension_settings } from "@ST/scripts/extensions.js";
import {
  IExtenstionSettings,
  defaultExtensionSettings
} from "@/models/ExtensionSettings";
import { getContext } from "@ST/scripts/extensions.js";

const globalContext = getContext();

export function getSTExtensionSettings() {
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

export function setSTExtensionSettings(newSettings: IExtenstionSettings) {
  // @ts-expect-error global extensions settings
  extension_settings[defaultExtensionSettings.name] = newSettings;
  saveSettingsDebounced();
  return newSettings;
}

function tryGetToken() {
  // https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps#redirecting
  console.log("[Music box] tryGetToken");
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get("source");
  if (source !== "youtube") {
    return null;
  }
  const params = new URLSearchParams(window.location.href);

  console.log("[Music Box] urlParams = ", urlParams);
  console.log("[Music Box] params = ", params);
  const access_token = params.get("access_token");
  if (access_token) {
    globalContext.extensionSettings["Music Box"].token = access_token;
    globalContext.saveSettingsDebounced();
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

export function attachTokenListner() {
  globalContext.eventSource.on(
    globalContext.event_types.APP_READY,
    tryGetToken
  );
}
