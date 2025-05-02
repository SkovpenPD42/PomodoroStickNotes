import React, { useState, useRef } from "react";

const LofiPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Помилка відтворення:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-2xl mt-4 p-4 bg-gray-800 rounded-lg shadow-md flex items-center justify-between">
      <span className="text-lg font-semibold">🎧 LOFI-Radio</span>
      <button
        className="bg-blue-500 px-4 py-2 rounded text-white"
        onClick={togglePlay}
      >
        {isPlaying ? "⏸️ Зупинити" : "▶️ Відтворити"}
      </button>
      <audio
        ref={audioRef}
        loop
        src="https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/"
      />
    </div>
  );
};

export default LofiPlayer;
