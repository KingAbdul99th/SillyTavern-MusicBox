
export interface IExtenstionSettings {
  name: string;
  enabled: boolean;
  removeExtras: boolean;
}

export const defaultExtensionSettings: IExtenstionSettings = {
  name: "Music Box",
  enabled: true,
  removeExtras: true
};

export const extensionSettingsEventTypes = {
    UPDATE: "MUSICBOX_SETTINGS_UPDATE"
}