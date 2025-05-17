import React, { useState } from "react";
import MusicPlayer from "./components/MusicPlayer";
import { PlaylistManager } from "./components/PlaylistManager";
import { defaultPlaylist } from "./models/Playlist";
import { Callback } from "./EventEmitter";
import { defaultExtensionSettings, IExtenstionSettings } from "./models/ExtensionSettings";
import { EventEmitter } from "./EventEmitter";


interface SettingsDrawerProps {
  eventEmitter: EventEmitter;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({eventEmitter}) => {
  let extensionSettings: IExtenstionSettings = defaultExtensionSettings;
  const extensionSettingsUpdated: Callback = (eventData: unknown) => {
    extensionSettings = eventData as IExtenstionSettings;
  }
  eventEmitter.on("SETTINGS_UPDATE", extensionSettingsUpdated);
  const [enabled, setEnabled] = useState(extensionSettings.enabled);
  const [musicVideoId, setMusicVideoId] = useState("Jlv2NxO0qVU");
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleEnabledClick() {
    const newSettings = {
      ...extensionSettings,
      enabled: !extensionSettings.enabled
    }
    eventEmitter.emit("SETTINGS_UPDATE", newSettings)
    console.log("enable toggled ", extensionSettings.enabled);
    setEnabled(extensionSettings.enabled);
  }

  function handleDrawerOpenClick() {
    setDrawerOpen(!drawerOpen);
  }
  const onVideoIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVideoId = event.target.value;
    setMusicVideoId(newVideoId);
  };

  return (
    <>
      <div className="drawer">
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
          <input
            type="text"
            className="text_pole"
            placeholder="videoId"
            value={musicVideoId}
            onChange={onVideoIdChange}
          />
          <MusicPlayer videoId={musicVideoId} />
          <PlaylistManager
            playlists={[defaultPlaylist]}
            selectedPlaylist={defaultPlaylist.name}
          />
        </div>
      </div>
    </>
  );

}