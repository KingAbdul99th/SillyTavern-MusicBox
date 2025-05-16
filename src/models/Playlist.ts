export interface PlaylistItem {
  videoId: string;
}

export interface Playlist {
  name: string;
  items: PlaylistItem[];
}

export const defaultPlaylist: Playlist = {
    name: "default",
    items: [
        {
            "videoId": "Jlv2NxO0qVU",
        },
        {
            "videoId": "o-nq6FiSBSs",
        }
    ]
}
