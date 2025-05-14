// src/YouTubeMusicPlayer.tsx
import React, { useState, useCallback } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer, YouTubeProps } from 'react-youtube';

interface YouTubeMusicPlayerProps {
  videoId: string; // The ID of the YouTube music video
}

const YouTubeMusicPlayer: React.FC<YouTubeMusicPlayerProps> = ({ videoId }) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50); // Initial volume

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === YouTube.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };

  const onPlay = useCallback(() => {
    player?.playVideo();
    setIsPlaying(true);
  }, [player]);

  const onPause = useCallback(() => {
    player?.pauseVideo();
    setIsPlaying(false);
  }, [player]);

  const onSeek = useCallback((seconds: number) => {
    player?.seekTo(seconds, true);
  }, [player]);

  const onError = (err: YouTubeEvent<number>) => {
    console.log(err);
  };
  
  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value, 10);
    setVolume(newVolume);
    player?.setVolume(newVolume);
  }, [player]);

  const handleTimeUpdate = useCallback(() => {
    if (player && isPlaying) {
      setCurrentTime(player.getCurrentTime());
    }
  }, [player, isPlaying]);

  // Update current time periodically when playing
  React.useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(handleTimeUpdate, 1000); // Update every second
      return () => clearInterval(intervalId);
    }
    return undefined;
  }, [isPlaying, handleTimeUpdate]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="youtube-music-player">
      <YouTube
        videoId={videoId}
        opts={{
          height: '0', // Set to 0 to hide the video visually, we only want audio
          width: '0',
          playerVars: {
            autoplay: 1, // Or 0 if you prefer to start paused
            controls: 0, // Hide default controls
            disablekb: 1, // Disable keyboard controls
            showinfo: 0, // Hide video title
            modestbranding: 1, // Show minimal YouTube branding
            rel: 0, // Prevent related videos from showing
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
      />

      <div className="controls">
        <button onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="time-slider">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
          />
          <span>{formatTime(duration)}</span>
        </div>
        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      <style>{`
        .youtube-music-player {
          /* Add your styling here */
          border: 1px solid #ccc;
          padding: 16px;
          margin-bottom: 16px;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 10px;
        }

        .time-slider {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .time-slider input[type="range"] {
          flex-grow: 1;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* You can add more styles to customize the appearance */
      `}</style>
    </div>
  );
};

export default YouTubeMusicPlayer;