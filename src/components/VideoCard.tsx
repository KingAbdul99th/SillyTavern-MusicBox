import { Dictionary } from "lodash";



interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface VideoCardProps {
  title: string;
  videoId: string;
  thumbnails: Dictionary<Thumbnail>;
}

export const VideoCard: React.FC<VideoCardProps> = ({ title, videoId, thumbnails }) => {
  return <>
    <div>{title}</div>
    <div>{videoId}</div>
    <img src={thumbnails["default"].url} />
  </>
}
