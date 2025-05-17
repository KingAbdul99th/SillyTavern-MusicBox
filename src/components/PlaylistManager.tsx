import { Playlist } from "../models/Playlist";


interface PlaylistManagerProps {
  playlists: Playlist[];
  selectedPlaylist: string;
}

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  selectedPlaylist
}) => {
  const listItems = playlists.map(playlist => <option value={playlist.name}>{playlist.name}</option>)
  return <div>
    <label htmlFor="musicbox-selected-playlist">{selectedPlaylist}</label>
    <select id="musicbox-selected-playlist">{listItems}</select>
  </div>;
};
