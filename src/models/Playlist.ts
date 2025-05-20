export interface PlaylistItem {
  videoId: string;
}

export interface Playlist {
  id: string;
  snippet: { [key: string]: string };
}

export const defaultPlaylist: Playlist = {
    id: "default",
    snippet: {
      "title": "default"
    }
}
