
export interface IExtenstionSettings {
  name: string;
  enabled: boolean;
  clientId: string;
  removeExtras: boolean;
}

export const defaultExtensionSettings: IExtenstionSettings = {
  name: "Music Box",
  enabled: true,
  clientId: "",
  removeExtras: true
};

export const extensionSettingsEventTypes = {
    UPDATE: "MUSICBOX_SETTINGS_UPDATE"
}