import React, { useState } from "react";
import {
  getExtensionSettings,
  setExtensionSettings
} from "./ExtensionSettings";
import MusicPlayer from "./components/MusicPlayer";

export default function Settings() {
  let extensionSettings = getExtensionSettings();
  const [enabled, setEnabled] = useState(extensionSettings.enabled);
  const [musicVideoId, setMusicVideoId] = useState("dQw4w9WgXcQ");

  async function handleEnabledClick() {
    extensionSettings = setExtensionSettings({
      ...extensionSettings,
      enabled: !extensionSettings.enabled
    });
    console.log("enable toggled ", extensionSettings.enabled);
    setEnabled(extensionSettings.enabled);
  }

  return (
    <>
      <div className="inline-drawer">
        <div className="inline-drawer-toggle inline-drawer-header">
          <b>{extensionSettings.name}</b>
          <div className="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div className="inline-drawer-content">
          <div className="music-box-block flex-container">
            <input
              id="music-box-enable"
              type="checkbox"
              onClick={handleEnabledClick}
              checked={enabled}
            />
            <label htmlFor="music-box-enable">Enable music-box</label>
          </div>
          <hr className="sysHR" />
          <MusicPlayer videoId={musicVideoId} />
        </div>
      </div>
    </>
  );
}
