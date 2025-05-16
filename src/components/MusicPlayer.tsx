import React, { useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, AlignCenter } from "lucide-react";
import YouTube, {
  YouTubeEvent,
  YouTubePlayer,
  YouTubeProps
} from "react-youtube";

interface MusicPlayerProps {
  videoId: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ videoId }) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100); // Default volume is 1 (full)
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const onReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
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

  const onSeek = useCallback(
    (seconds: number) => {
      player?.seekTo(seconds, true);
    },
    [player]
  );

  const onError = (err: YouTubeEvent<number>) => {
    console.log(err);
  };

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(event.target.value);
      setVolume(newVolume);
      player?.setVolume(newVolume);
    },
    [player]
  );

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
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    // @ts-expect-error testing
    <div style={styles.container}>
      <YouTube
        videoId={videoId}
        opts={{
          height: "0", // Set to 0 to hide the video visually, we only want audio
          width: "0",
          playerVars: {
            autoplay: 0, // Or 0 if you prefer to start paused
            controls: 1, // Hide default controls
            disablekb: 1, // Disable keyboard controls
            showinfo: 1, // Hide video title
            modestbranding: 1, // Show minimal YouTube branding
            rel: 0 // Prevent related videos from showing
          }
        }}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
        style={{display: "none"}}
      />
      <input type="text" className="text_pole" placeholder="videoId" />
      <div style={styles.controls}>
        <button
          onClick={isPlaying ? onPause : onPlay}
          style={styles.playPauseButton}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause style={styles.icon} />
          ) : (
            <Play style={styles.icon} />
          )}
        </button>
        <div style={styles.timeSlider}>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            style={styles.slider}
            aria-label="Time"
          />
          <div style={styles.timeDisplay}>
            <span>{formatTime(currentTime)}</span>
            <span style={{textAlign: "right", marginLeft: "auto"}}>{formatTime(duration)}</span>
          </div>
        </div>
        <button
          onClick={toggleMute}
          style={styles.muteButton}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? (
            <VolumeX style={styles.icon} />
          ) : (
            <Volume2 style={styles.icon} />
          )}
        </button>
        <div style={styles.volumeContainer}>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={volume}
            onChange={handleVolumeChange}
            style={styles.slider}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    width: "32rem"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "1rem",
  },
  playPauseButton: {
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px", // rounded-full
    border: "1px solid #d1d5db",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0
  },
  muteButton: {
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px", // rounded-full
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0
  },
  icon: {
    width: "1.5rem",
    height: "1.5rem",
    color: "#4b5563"
  },
  timeSlider: {
    flex: "1",
    AlignCenter,
    paddingTop: "2rem"
  },
  slider: {
    width: "100%"
  },
  timeDisplay: {
    display: "flex",
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.5rem"
  },
  volumeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  volumeSlider: {
    width: "10rem"
  }
};

export default MusicPlayer;
