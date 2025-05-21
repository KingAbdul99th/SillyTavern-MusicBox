import MusicPlayer from "./MusicPlayer";
import { PlaylistManager } from "./PlaylistManager";
import { defaultPlaylist } from "../models/Playlist";
import { useState } from "react";
import { IExtenstionSettings } from "../models/ExtensionSettings";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { token } from "@ST/script";


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
const LoginButton = ({extensionSettings, setExtensionSettings}) => {
  const setToken = (res: string) => {
    console.log("[Music Box] Success youtube login", location.href);
    const newSettings = {
      ...extensionSettings,
      token: res,
    }
    setExtensionSettings(newSettings);
  }
 const login = useGoogleLogin({
    onSuccess: tokenResponse => setToken(tokenResponse.code),
    onError: err => console.log(err),
    onNonOAuthError: err => console.log(err),
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    ux_mode: "redirect",
    // redirect_uri: "http://localhost:8000/callback/youtube"
    redirect_uri: new URL("/callback/youtube", location.origin).toString()
  });
  
  return <button className="menu_button menu_button_icon interactable" onClick={() => login()}>Sign in with Google 🚀</button>
}

// @ts-expect-error blah
const GoogleLogin = ({clientId, extensionSettings, setExtensionSettings}) => {
  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <LoginButton extensionSettings={extensionSettings} setExtensionSettings={setExtensionSettings}/>
      </GoogleOAuthProvider>
    </>
  )
}

export const DrawerContent: React.FC<DrawerProps> = ({
  extensionSettings,
  setExtensionSettings
}) => {
  const [musicVideoId, setMusicVideoId] = useState("Jlv2NxO0qVU");
  const [clientId, setClientId] = useState(extensionSettings.clientId);
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
  };

  const onLoadPlaylists = () => {
    getAllYoutubePlaylists(extensionSettings.token).then((data) => {
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
      <input className="text_pole" type="text" value={clientId} onChange={onClientIdChange}></input>
      <button className="menu_button menu_button_icon interactable" onClick={onClientIdSave}>Save ClientId</button>
      <button className="menu_button menu_button_icon interactable" onClick={onLoadPlaylists}>Load Playlists</button>
      <GoogleLogin clientId={clientId} extensionSettings={extensionSettings} setExtensionSettings={setExtensionSettings} />
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
