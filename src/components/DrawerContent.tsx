import MusicPlayer from "./MusicPlayer";
import { PlaylistManager } from "./PlaylistManager";
import { defaultPlaylist } from "../models/Playlist";
import { useEffect, useState } from "react";
import { IExtenstionSettings } from "../models/ExtensionSettings";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";


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
  console.log(pages);
  return pages;
}

// @ts-expect-error blah
const LoginButton = ({setToken}) => {
 const login = useGoogleLogin({
    onSuccess: tokenResponse => setToken(tokenResponse.access_token),
    flow: "implicit",
    scope: "https://www.googleapis.com/auth/youtube.readonly"
  });
  
  return <button onClick={() => login()}>Sign in with Google 🚀</button>
}

// @ts-expect-error blah
const GoogleLogin = ({clientId, setToken}) => {
  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <LoginButton setToken={setToken} />
      </GoogleOAuthProvider>
    </>
  )
}

export const DrawerContent: React.FC<DrawerProps> = ({
  extensionSettings,
  setExtensionSettings
}) => {
  const [musicVideoId, setMusicVideoId] = useState("Jlv2NxO0qVU");
  const [clientId, setClientId] = useState("test");
  const [token, setToken] = useState("test");
  const [playlists, setPlaylists] = useState([]);

  const handleEnabledClick = () => {
    const newSettings = {
      ...extensionSettings,
      enabled: !extensionSettings.enabled
    };
    setExtensionSettings(newSettings);
    console.log("enable toggled ", extensionSettings.enabled);
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
    console.log("clientId updated ", extensionSettings.clientId);
  };

  const onLoadPlaylists = () => {
    getAllYoutubePlaylists(token).then((data) => {
      console.log(data);
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
      <input type="text" value={clientId} onChange={onClientIdChange}></input>
      <button onClick={onClientIdSave}>Save ClientId</button>
      <button onClick={onLoadPlaylists}>Load Playlists</button>
      <GoogleLogin clientId={clientId} setToken={setToken} />
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <MusicPlayer videoId={musicVideoId} />
        <PlaylistManager
          playlists={playlists}
          selectedPlaylist={defaultPlaylist.id}
        />
        {/* <RiveComponent /> */}
      </div>
    </>
  );
};
