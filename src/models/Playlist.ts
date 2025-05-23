export interface PlaylistItem {
  videoId: string;
}

export interface IPlaylist {
  id: string;
  snippet: { [key: string]: string };
}

export const defaultPlaylist: IPlaylist = {
  id: "default",
  snippet: {
    title: "default"
  }
};
