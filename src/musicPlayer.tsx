import React, { useState, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  audioUrl: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1); // Default volume is 1 (full)

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleLoadedMetadata = () => {
      if (audioElement) {
        setDuration(audioElement.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    if (audioElement) {
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      setIsPlaying(!isPlaying);
      if(isPlaying) audioRef.current.pause()
      else audioRef.current.play();
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(event.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newVolume = parseFloat(event.target.value);
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    // @ts-expect-error temp
    <div style={styles.container}>
      <audio ref={audioRef} src={audioUrl} />
      <div style={styles.controls}>
        <button onClick={togglePlay} style={styles.button}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div style={styles.timeSlider}>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleTimeChange}
            style={styles.slider}
          />
          <div style={styles.timeDisplay}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <div style={styles.volumeControl}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            style={styles.volumeSlider}
          />
          <span style={styles.volumeIcon}>🔊</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '400px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginTop: '10px',
  },
  button: {
    padding: '10px 15px',
    marginRight: '15px',
    cursor: 'pointer',
  },
  timeSlider: {
    flexGrow: 1,
    marginRight: '15px',
  },
  slider: {
    width: '100%',
  },
  timeDisplay: {
    fontSize: '0.8em',
    color: '#555',
    marginTop: '5px',
  },
  volumeControl: {
    display: 'flex',
    alignItems: 'center',
  },
  volumeSlider: {
    width: '80px',
  },
  volumeIcon: {
    marginLeft: '5px',
    fontSize: '1.2em',
    color: '#333',
  },
};

export default MusicPlayer;