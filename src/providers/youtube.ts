import { logger } from "@/utils/logger";

async function getYoutubePlaylists(token: string, pageToken: string | null) {
  let url =
    "https://www.googleapis.com/youtube/v3/playlists?" +
    "part=snippet,player" +
    "&mine=true" +
    "&maxResults=50" +
    "&access_token=" +
    token;

  if (pageToken) {
    url = url + "&pageToken=" + pageToken;
  }

  const response = await fetch(url, {
    headers: new Headers({
      Accept: "application/json"
    })
  });
  return response.json();
}

export async function getPlaylists(token: string) {
  const pages = [];
  let nextPage = await getYoutubePlaylists(token, null);
  pages.push(nextPage);
  while (nextPage["nextPageToken"]) {
    nextPage = await getYoutubePlaylists(token, nextPage["nextPageToken"]);
    pages.push(nextPage);
  }
  logger.debug("Received playlists", pages);
  return pages;
}