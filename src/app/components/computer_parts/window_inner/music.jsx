import http from "../../../axios/http";
import styles from "./music.module.scss";

import { useRef, useEffect, useState } from "react";
export function MusicWindow({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [musics, setMusics] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [showVisualiser, setShowVisualiser] = useState(false);

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);

  async function getMusics() {
    try {
      const response = await http.get("musics");
      return response.data;
    } catch (error) {
      console.error("Error fetching menu:", error);
      return null;
    }
  }
  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const data = await getMusics();
        setMusics(data);
        console.log(musics);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMusics();
  }, []);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  useEffect(() => {
    if (showVisualiser) {
      setupVisualizer();
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  }, [showVisualiser]);
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const changeTrack = (direction) => {
    setCurrentTrack((prev) => {
      const newTrack =
        direction === "next"
          ? (prev + 1) % musics.length
          : (prev - 1 + musics.length) % musics.length;
      return newTrack;
    });
    setIsPlaying(true);
  };

  const setupVisualizer = () => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      source.connect(analyser);
      analyser.connect(audioContextRef.current.destination);

      analyserRef.current = analyser;
      drawVisualizer();
    }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      ctx.moveTo(0, canvas.height / 2);

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255;
        const y = (v * canvas.height) / 2;

        ctx.lineTo(x, canvas.height / 2 - y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      setupVisualizer();
    }

    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audioContextRef.current.resume().then(() => {
        audioRef.current.play();
      });
    }
    setIsPlaying(!isPlaying);
  };
  const toggleVisualiser = () => {
    setShowVisualiser((prev) => {
      const newState = !prev;
      
      // Restart visualizer when turned on
      if (newState) {
        setupVisualizer();
      }
  
      return newState;
    });
  };
  

  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newProgress = (offsetX / rect.width) * duration;
    setProgress(newProgress);
    audioRef.current.currentTime = newProgress;
  };

  return (
    <div className={styles.applicationInner}>
      {musics.length > 0 && (
        <audio
          ref={audioRef}
          src={musics[currentTrack]?.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={() => changeTrack("next")}
          autoPlay={isPlaying}
          crossOrigin="anonymous"
        />
      )}
      <div className={styles.musicTitle}>
        <span>{musics[currentTrack]?.title}</span>
        <button className={styles.musicChart} ><img src="/img/music/visualiser.png" alt="" /></button>
      </div>
      {showVisualiser && (
        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          className={styles.visualizer}
        />
      )}

      <div className={styles.progressContainer}>
        <div className={styles.progressContainer__length}>
          <span>{Math.floor(progress)}s</span>
        </div>
        <div
          className={styles.customSlider}
          ref={progressRef}
          onClick={handleProgressClick}
        >
          <div
            className={styles.progressBar}
            style={{ left: `${(progress / duration) * 100}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max={duration}
            value={progress}
            onChange={(e) => {
              const time = e.target.value;
              setProgress(time);
              if (audioRef.current) audioRef.current.currentTime = time;
            }}
          />
        </div>
        <div className={styles.progressContainer__length}>
          <span>{Math.floor(duration)}s</span>
        </div>
      </div>
      <div className={styles.flexBottom}>
        <div className={styles.controls}>
          <button onClick={() => changeTrack("prev")}>
            <img src="/img/music/prev.png" alt="" />
          </button>
          <button onClick={togglePlayPause}>
            {isPlaying ? (
              <img src="/img/music/pause.png" alt="" />
            ) : (
              <img src="/img/music/play.png" alt="" />
            )}
          </button>
          <button onClick={() => changeTrack("next")}>
            <img src="/img/music/next.png" alt="" />
          </button>
        </div>

        <div className={styles.volumeControl}>
          <img src="/img/music/volume.png" alt="" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
