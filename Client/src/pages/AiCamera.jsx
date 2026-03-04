import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCpu } from "react-icons/fi";
import EmotionDetector from "../components/EmotionDetector";
import MoodPlaylist from "../components/MoodPlaylist";
import PlayerBar from "./AiPlayerBar";

export default function AiCamera() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const navigate = useNavigate();

  const backHome = () => {
    window.dispatchEvent(new Event("STOP_CAMERA"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-32 px-6">
      <div className="fixed top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-lg">
                <FiCpu size={16} />
              </div>
              <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest">AI Laboratory</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mood Discovery</h1>
            <p className="text-gray-500 font-medium">Let our AI detect your mood and curate the perfect soundtrack.</p>
          </div>
          <button
            onClick={backHome}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50 transition-all hover:scale-105"
          >
            <FiArrowLeft /> Back to Home
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="flex flex-col">
            <EmotionDetector onSongs={setSongs} />
          </div>
          <div className="flex flex-col">
            <MoodPlaylist songs={songs} onPlay={setCurrentSong} />
          </div>
        </div>
      </div>

      {currentSong && <PlayerBar song={currentSong} />}
    </div>
  );
}
