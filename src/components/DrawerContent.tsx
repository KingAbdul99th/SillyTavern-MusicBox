import MusicPlayer from "./MusicPlayer";
import { PlaylistManager } from "./PlaylistManager";
import { defaultPlaylist } from "../models/Playlist";
import { useState } from "react";
import { IExtenstionSettings } from "../models/ExtensionSettings";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

interface DrawerProps {
  extensionSettings: IExtenstionSettings;
  setExtensionSettings: (newSettings: IExtenstionSettings) => void;
}

export const DrawerContent: React.FC<DrawerProps> = ({
  extensionSettings,
  setExtensionSettings
}) => {
  const [musicVideoId, setMusicVideoId] = useState("Jlv2NxO0qVU");
  const [clientId, setClientId] = useState("");
  const [token, setToken] = useState("");

  function handleEnabledClick() {
    const newSettings = {
      ...extensionSettings,
      enabled: !extensionSettings.enabled
    };
    setExtensionSettings(newSettings);
    console.log("enable toggled ", extensionSettings.enabled);
  }

  const onClientIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newClientId = event.target.value;
    setClientId(newClientId);

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
      <input type="text" value={clientId} onChange={onClientIdChange}></input>
      <div style={{display: clientId? "block": "none"}}>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
              if(credentialResponse.credential) {
                setToken(credentialResponse.credential);
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            useOneTap
          />;
        </GoogleOAuthProvider>
      </div>
      <div style={{display: "flex", flexDirection: "row", gap: "1rem"}}>
        <MusicPlayer videoId={musicVideoId} />
        <PlaylistManager
          playlists={[defaultPlaylist]}
          selectedPlaylist={defaultPlaylist.name}
        />
          {/* <RiveComponent /> */}
      </div>
    </div>
  );
};
