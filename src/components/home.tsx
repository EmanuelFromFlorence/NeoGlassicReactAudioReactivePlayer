import React from "react";
import AudioPlayer from "./AudioPlayer";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Modern Audio Player
        </h1>
        <AudioPlayer />
      </div>
    </div>
  );
};

export default Home;
