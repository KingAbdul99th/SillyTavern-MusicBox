import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
    audioUrl: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(1); // Default volume is 1 (full)
    const [isMuted, setIsMuted] = useState<boolean>(false);

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
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isPlaying ? audioRef.current.pause() : audioRef.current.play();
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
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                // Restore the previous volume
                audioRef.current.volume = volume;
            } else {
                // Mute the audio
                setVolume(0);
                audioRef.current.volume = 0;
            }
            setIsMuted(!isMuted);
        }
    };

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        // @ts-expect-error testing
        <div style={styles.container}>
            <audio ref={audioRef} src={audioUrl} />
            <div style={styles.controls}>
                <button onClick={togglePlay} style={styles.playPauseButton} aria-label={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? <Pause style={styles.icon} /> : <Play style={styles.icon} />}
                </button>
                <div style={styles.timeSlider}>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleTimeChange}
                        style={styles.slider}
                        aria-label="Time"
                    />
                    <div style={styles.timeDisplay}>
                        {formatTime(currentTime)} / {formatTime(duration || 0)}
                    </div>
                </div>
                <div style={styles.volumeContainer}>
                    <button onClick={toggleMute} style={styles.muteButton} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted || volume === 0 ? (
                            <VolumeX style={styles.icon} />
                        ) : (
                            <Volume2 style={styles.icon} />
                        )}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={styles.volumeSlider}
                        aria-label="Volume"
                    />
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
        backgroundColor: '#f3f4f6', // bg-gray-100
        border: '1px solid #d1d5db', // border-gray-300
        borderRadius: '0.5rem',       // rounded-lg
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
        width: '32rem',             // max-w-md
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginTop: '1rem',         // mt-4
        gap: '1rem'
    },
    playPauseButton: {
        width: '3rem',           // w-12
        height: '3rem',          // h-12
        borderRadius: '9999px', // rounded-full
        border: '1px solid #d1d5db',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0
    },
    muteButton: {
        width: '2.5rem',           // w-10
        height: '2.5rem',          // h-10
        borderRadius: '9999px', // rounded-full
        border: 'none',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0
    },
    icon: {
        width: '1.5rem',         // w-6
        height: '1.5rem',         // h-6
        color: '#4b5563'
    },
    timeSlider: {
        flex: '1',
        marginRight: '1rem',     // mr-4
    },
    slider: {
        width: '100%',
    },
    timeDisplay: {
        fontSize: '0.75rem',     // text-xs
        color: '#6b7280',       // text-gray-500
        marginTop: '0.25rem',     // mt-1
    },
    volumeContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    volumeSlider: {
        width: '10rem',         // w-40
    },
};

export default MusicPlayer;
