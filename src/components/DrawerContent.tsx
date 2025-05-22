import { MusicPlayer } from "@/components/MusicPlayer";
import { PlaylistManager } from "@/components/PlaylistManager";
import { defaultPlaylist } from "@/models/Playlist";
import { useState } from "react";
import { IExtenstionSettings } from "@/models/ExtensionSettings";
import { LoginButton } from "@/components/Auth";
import { logger } from "@/utils/logger";

interface DrawerProps {
  extensionSettings: IExtenstionSettings;
  setExtensionSettings: (newSettings: IExtenstionSettings) => void;
}

async function getYoutubePlaylists(token: string, pageToken: string | null) {
  let url =
    "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true" +
    "&maxResults=100" +
    "&access_token=" + token;
  if(pageToken) {
    url = url + "&pageToken=" + pageToken;
  }
  const response = await fetch(url, {
    headers: new Headers({
      Accept: "application/json"
    })
  });
  return response.json();
}

async function getAllYoutubePlaylists(token: string) {
  const pages = [];
  let nextPage = await getYoutubePlaylists(token, null);
  pages.push(nextPage);
  while(nextPage["nextPageToken"]) {
    nextPage = await getYoutubePlaylists(token, nextPage["nextPageToken"])
    pages.push(nextPage);
  }
  logger.debug("Received playlists", pages)
  return pages;
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
    logger.info("Enabled toggled", extensionSettings.enabled)
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
    getAllYoutubePlaylists(extensionSettings.token).then((data) => {
      setPlaylists(data[0].items);
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
        <label htmlFor="music-box-enable">Enable music-box</label>
      </div>
      <hr />
      <input className="text_pole" type="text" value={clientId} onChange={onClientIdChange}></input>
      <button className="menu_button menu_button_icon interactable" onClick={onClientIdSave}>Save ClientId</button>
      <LoginButton extensionSettings={extensionSettings}/>
      <button className="menu_button menu_button_icon interactable" onClick={onLoadPlaylists}>Load Playlists</button>
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
