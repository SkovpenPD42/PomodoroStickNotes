import React, { useRef, useState } from "react";
import { FaHeadphones, FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg shadow-md mb-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 text-white">
          <FaHeadphones />
          <span className="font-semibold">LOFI-Radio</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            onClick={togglePlay}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <div className="flex items-center">
            <FaVolumeUp className="mr-1 text-white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Хвилі */}
      {isPlaying && (
        <div className="wave-wrapper">
          {[...Array(150)].map((_, i) => (
            <div key={i} className="wave" style={{ animationDelay: `${i * 0.02}s` }}></div>
          ))}
        </div>
      )}

      <audio
        ref={audioRef}
        loop
        src="https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/"
      />
    </div>
  );
};

export default MusicPlayer;
