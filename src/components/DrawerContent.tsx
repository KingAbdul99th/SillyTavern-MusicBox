import { MusicPlayer } from "@/components/MusicPlayer";
import { PlaylistManager } from "@/components/PlaylistManager";
import { defaultPlaylist } from "@/models/Playlist";
import React, { useState } from "react";
import { IExtenstionSettings } from "@/models/ExtensionSettings";
import { LoginButton } from "@/components/Auth";
import { logger } from "@/utils/logger";
import { CONSTS } from "@/utils/consts";
import { getPlaylists } from "@/providers/youtube";

interface DrawerProps {
  extensionSettings: IExtenstionSettings;
  setExtensionSettings: (newSettings: IExtenstionSettings) => void;
}


const SourceList: React.FC = () => {
  return <>
      Music Source
      <select id="musicbox-selected-source" style={{ width: "200px" }} value="local">
        <option>local</option>
        <option>youtube</option>
        <option>spotify</option>
      </select>
    </>
}

export const DrawerContent: React.FC<DrawerProps> = ({
  extensionSettings,
  setExtensionSettings
}) => {
  const [videoId, setVideoId] = useState("Jlv2NxO0qVU");
  const [clientId, setClientId] = useState(extensionSettings.clientId);
  const [playlists, setPlaylists] = useState([]);

  const handleEnabledClick = () => {
    const newSettings = {
      ...extensionSettings,
      enabled: !extensionSettings.enabled
    };
    setExtensionSettings(newSettings);
    logger.info("Enabled toggled", extensionSettings.enabled);
  };

  const onClientIdSave = () => {
    const newSettings = {
      ...extensionSettings,
      clientId: clientId
    };
    setExtensionSettings(newSettings);
  };

  const onClientIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newClientId = event.target.value;
    setClientId(newClientId);
  };

  const onLoadPlaylists = () => {
    getPlaylists(extensionSettings.token).then((data) => {
      // @ts-expect-error untyped response
      setPlaylists(data.flatMap((x) => x.items));
    });
  };

  return (
    <>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        <input
          id="music-box-enable"
          type="checkbox"
          onClick={handleEnabledClick}
          checked={extensionSettings.enabled}
        />
        <label htmlFor="music-box-enable">Enable {CONSTS.extensionName}</label>
        <SourceList></SourceList>
      </div>
      <hr />
      <input
        className="text_pole"
        type="text"
        value={clientId}
        onChange={onClientIdChange}
      ></input>
      <div className="flex-container">
        <button
          className="menu_button menu_button_icon interactable"
          onClick={onClientIdSave}
        >
          Save ClientId
        </button>
        <LoginButton extensionSettings={extensionSettings} />
        <button
          className="menu_button menu_button_icon interactable"
          onClick={onLoadPlaylists}
        >
          Load Playlists
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <MusicPlayer videoId={videoId} />
        <PlaylistManager
          playlists={playlists}
          selectedPlaylist={defaultPlaylist.id}
        />
      </div>
    </>
  );
};
