import { IPlaylist } from "@/models/Playlist";

interface PlaylistManagerProps {
  playlists: IPlaylist[];
  selectedPlaylist: string;
}

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  selectedPlaylist
}) => {
  let listItems;
  if (Array.isArray(playlists)) {
    listItems = playlists.map((playlist) => (
      <option key={playlist.id} value={playlist.snippet["title"]}>
        {playlist.snippet["title"]}
      </option>
    ));
  }
  return (
    <div>
      <label htmlFor="musicbox-selected-playlist">{selectedPlaylist}</label>
      <select id="musicbox-selected-playlist" style={{ width: "200px" }}>
        {listItems}
      </select>
    </div>
  );
};
