import { useState } from "react";
import { Playlist } from "../models/Playlist";


interface PlaylistManagerProps {
  playlists: Playlist[];
  selectedPlaylist: string;
}

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  selectedPlaylist
}) => {
  return <div>
    <text>{selectedPlaylist}</text>
  </div>;
};
