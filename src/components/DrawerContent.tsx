import MusicPlayer from "./MusicPlayer";
import { PlaylistManager } from "./PlaylistManager";
import { defaultPlaylist } from "../models/Playlist";
import { useState } from "react";
import { IExtenstionSettings } from "../models/ExtensionSettings";

interface DrawerProps {
  extensionSettings: IExtenstionSettings;
  setExtensionSettings: (newSettings: IExtenstionSettings) => void;
}

export const DrawerContent: React.FC<DrawerProps> = ({
  extensionSettings,
  setExtensionSettings
}) => {
  const [musicVideoId, setMusicVideoId] = useState("Jlv2NxO0qVU");

  function handleEnabledClick() {
    const newSettings = {
      ...extensionSettings,
      enabled: !extensionSettings.enabled
    };
    setExtensionSettings(newSettings);
    console.log("enable toggled ", extensionSettings.enabled);
  }

  const onVideoIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVideoId = event.target.value;
    setMusicVideoId(newVideoId);
  };

  return (
    <div>
      <div style={{display: "flex", gap: "5px", flexWrap: "wrap"}}>
        <input
          id="music-box-enable"
          type="checkbox"
          onClick={handleEnabledClick}
          checked={extensionSettings.enabled}
        />
        <label htmlFor="music-box-enable">Enable music-box</label>
      </div>
      <hr />
      <input
        type="text"
        placeholder="videoId"
        value={musicVideoId}
        onChange={onVideoIdChange}
      />
      <div style={{display: "flex", flexDirection: "row", gap: "1rem"}}>
        <MusicPlayer videoId={musicVideoId} />
        <PlaylistManager
          playlists={[defaultPlaylist]}
          selectedPlaylist={defaultPlaylist.name}
        />
      </div>
    </div>
  );
};
