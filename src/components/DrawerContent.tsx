import MusicPlayer from "./MusicPlayer";
import { PlaylistManager } from "./PlaylistManager";
import { defaultPlaylist } from "../models/Playlist";
import { useState } from "react";
import { IExtenstionSettings } from "../models/ExtensionSettings";


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
const LoginButton = ({extensionSettings}) => {
 const login = (clientId: string) => {
    const callbackUrl = `${window.location.origin}/callback/youtube`;
    const googleClientId = clientId;
    const targetUrl = "https://accounts.google.com/o/oauth2/v2/auth"
    const form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', targetUrl);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params = {'client_id': googleClientId,
                  'redirect_uri': callbackUrl,
                  'response_type': 'token',
                  'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
                  'include_granted_scopes': 'true',
                  'state': 'pass-through value'};

    // Add form parameters as hidden input values.
    for (const p in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      // @ts-expect-error blah
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
    // window.location.href = targetUrl;
  };
  return <button className="menu_button menu_button_icon interactable" onClick={() => login(extensionSettings.clientId)}>Sign in with Google 🚀</button>
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
      <LoginButton extensionSettings={extensionSettings}/>
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
