import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiShuffle,
  FiRepeat,
  FiHeart,
  FiPlus,
  FiList,
  FiVolume2,
  FiX
} from "react-icons/fi";
import API from "../api/api.js";

const iconBase =
  "cursor-pointer transition text-gray-400 hover:text-black";

function PlaylistCover({ songs = [] }) {
  const covers = songs.filter(s => s?.coverUrl).slice(0, 4);

  if (covers.length === 0) {
    return (
      <div className="w-9 h-9 bg-gray-200 rounded flex items-center justify-center">
        <FiList className="text-gray-400" />
      </div>
    );
  }

  if (covers.length === 1) {
    return (
      <img src={covers[0].coverUrl} className="w-9 h-9 rounded object-cover" />
    );
  }

  if (covers.length === 2) {
    return (
      <div className="w-9 h-9 flex rounded overflow-hidden">
        {covers.map((s, i) => (
          <img key={i} src={s.coverUrl} className="w-1/2 h-full object-cover" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-9 h-9 grid grid-cols-2 grid-rows-2 rounded overflow-hidden">
      {covers.map((s, i) => (
        <img key={i} src={s.coverUrl} className="w-full h-full object-cover" />
      ))}
    </div>
  );
}

export default function PlayerBar({ playlist = [], initialIndex = 0 }) {
  const audioRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const [favourites, setFavourites] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [showQueue, setShowQueue] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("dotin_user"));
    } catch {
      return null;
    }
  }, []);

  const userId = user?.id;
  const current = playlist.length ? playlist[index] : null;

  useEffect(() => {
    if (!playlist.length) return;
    setIndex(Math.min(initialIndex, playlist.length - 1));
  }, [playlist, initialIndex]);

  useEffect(() => {
    if (!current?.url || !audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.src = current.url;
    audioRef.current.load();

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [current?.url]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    loadFavourites();
    loadPlaylists();
  }, [userId]);

  async function loadFavourites() {
    if (!userId) return;
    const res = await API.get(`/favorites/user/${userId}`);
    const map = {};
    (res.data || []).forEach(f => (map[f.songId._id] = true));
    setFavourites(map);
  }

  async function loadPlaylists() {
    if (!userId) return;
    const res = await API.get(`/playlists/user/${userId}`);
    setPlaylists(res.data || []);
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function next() {
    if (!playlist.length) return;

    if (shuffle) {
      let nextIndex = index;
      while (playlist.length > 1 && nextIndex === index) {
        nextIndex = Math.floor(Math.random() * playlist.length);
      }
      setIndex(nextIndex);
      return;
    }

    if (index < playlist.length - 1) {
      setIndex(index + 1);
    } else if (loop) {
      setIndex(0);
    }
  }

  function prev() {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setIndex(index > 0 ? index - 1 : playlist.length - 1);
    }
  }

  async function toggleFavourite() {
    if (!current || !userId) return;
    const songId = current.id;

    if (favourites[songId]) {
      await API.post("/favorites/remove", { userId, songId });
      setFavourites(f => {
        const n = { ...f };
        delete n[songId];
        return n;
      });
    } else {
      await API.post("/favorites/add", { userId, songId });
      setFavourites(f => ({ ...f, [songId]: true }));
    }

    window.dispatchEvent(new Event("dotin_favourites_changed"));
  }

  async function addToPlaylist(id) {
    await API.post("/playlists/add-song", {
      playlistId: id,
      songId: current.id
    });
    setShowAdd(false);
  }

  async function createAndAdd(e) {
    e.preventDefault();
    if (!newPlaylist.trim()) return;

    const res = await API.post("/playlists/create", {
      userId,
      name: newPlaylist
    });

    await API.post("/playlists/add-song", {
      playlistId: res.data._id,
      songId: current.id
    });

    setNewPlaylist("");
    setShowAdd(false);
    loadPlaylists();
  }

  function format(t) {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-cyan-50 border-t border-cyan-100 shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-1.5 md:py-2.5 flex flex-col md:flex-row items-center gap-4 md:gap-8 relative">

          {/* Tooltip Helper Component (Inline) */}
          <style dangerouslySetInnerHTML={{
            __html: `
            .player-tooltip {
              position: absolute;
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%) translateY(-8px);
              padding: 4px 8px;
              background: #0f172a;
              color: white;
              font-size: 10px;
              font-weight: 700;
              border-radius: 6px;
              white-space: nowrap;
              opacity: 0;
              visibility: hidden;
              transition: all 0.2s;
              pointer-events: none;
              z-index: 100;
            }
            .group:hover .player-tooltip {
              opacity: 1;
              visibility: visible;
              transform: translateX(-50%) translateY(-4px);
            }
            .player-tooltip::after {
              content: '';
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              border: 4px solid transparent;
              border-top-color: #0f172a;
            }
          `}} />

          {/* Section 1: Info */}
          <div className="flex items-center gap-3 w-full md:w-[320px]">
            <div className="relative group">
              <img
                src={current?.cover}
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-500 bg-gray-200"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-gray-900 truncate leading-tight">
                {current?.title || "Silence is Golden"}
              </div>
              <div className="text-[10px] font-semibold text-gray-500 truncate uppercase mt-0.5">
                {current?.artist || "The AI Engine"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group">
                <FiHeart
                  onClick={toggleFavourite}
                  className={`cursor-pointer transition-all hover:scale-110 active:scale-90 ${favourites[current?.id]
                      ? "text-pink-500"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                  size={18}
                />
                <span className="player-tooltip">{favourites[current?.id] ? "Remove" : "Favourite"}</span>
              </div>

              <div className="relative group">
                <button
                  onClick={() => setShowAdd(true)}
                  className="w-7 h-7 rounded-full bg-white/50 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                >
                  <FiPlus size={14} />
                </button>
                <span className="player-tooltip">Add to Playlist</span>
              </div>
            </div>
          </div>

          {/* Section 2: Controls */}
          <div className="w-full md:flex-1 flex flex-col items-center">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <FiShuffle
                  onClick={() => setShuffle(!shuffle)}
                  className={`cursor-pointer transition-all ${shuffle ? "text-sky-500" : "text-gray-400 hover:text-gray-600"}`}
                  size={16}
                />
                <span className="player-tooltip">Shuffle</span>
              </div>

              <div className="relative group">
                <FiSkipBack onClick={prev} className="cursor-pointer text-gray-900 hover:text-sky-500 transition-colors" size={18} />
                <span className="player-tooltip">Previous</span>
              </div>

              <div className="relative group">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} className="ml-0.5" />}
                </button>
                <span className="player-tooltip">{isPlaying ? "Pause" : "Play"}</span>
              </div>

              <div className="relative group">
                <FiSkipForward onClick={next} className="cursor-pointer text-gray-900 hover:text-sky-500 transition-colors" size={18} />
                <span className="player-tooltip">Next</span>
              </div>

              <div className="relative group">
                <FiRepeat
                  onClick={() => setLoop(!loop)}
                  className={`cursor-pointer transition-all ${loop ? "text-sky-500" : "text-gray-400 hover:text-gray-600"}`}
                  size={16}
                />
                <span className="player-tooltip">Repeat</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full max-w-xl mt-1.5 group/progress">
              <span className="text-[10px] font-bold text-gray-500 tabular-nums w-8">{format(currentTime)}</span>
              <div className="flex-1 relative h-4 flex items-center cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={e =>
                  (audioRef.current.currentTime =
                    duration * (e.target.value / 100))
                  }
                  className="absolute inset-0 w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-sky-500 group-hover/progress:h-1.5 transition-all"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-500 tabular-nums w-8">{format(duration)}</span>
            </div>
          </div>

          {/* Section 3: Settings */}
          <div className="hidden md:flex items-center gap-5 w-[220px] justify-end">
            <div className="relative group">
              <button
                onClick={() => setShowQueue(true)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-white/50 hover:text-gray-900 transition-all"
              >
                <FiList size={18} />
              </button>
              <span className="player-tooltip">Queue</span>
            </div>

            <div className="flex items-center gap-3 group/vol">
              <FiVolume2 className="text-gray-400 group-hover/vol:text-sky-500 transition-colors" size={16} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={e => setVolume(e.target.value)}
                className="w-20 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {showQueue && (
        <div className="fixed right-2 left-2 sm:left-auto sm:right-4 bottom-24 z-50 w-auto sm:w-80 bg-white rounded-xl shadow-lg border">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="font-semibold">Queue</div>
            <FiX className="cursor-pointer" onClick={() => setShowQueue(false)} />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {playlist.map((s, i) => (
              <div
                key={s.id}
                onClick={() => {
                  setIndex(i);
                  setShowQueue(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${i === index ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
              >
                <img
                  src={s.cover}
                  className="w-10 h-10 rounded object-cover bg-gray-200"
                />
                <div className="min-w-0">
                  <div className="text-sm truncate">{s.title}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {s.artist}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-[95%] sm:w-96 p-4 sm:p-5">
            <div className="flex justify-between mb-3">
              <div className="font-semibold">Add to playlist</div>
              <FiX className="cursor-pointer" onClick={() => setShowAdd(false)} />
            </div>

            <form onSubmit={createAndAdd} className="flex gap-2 mb-3">
              <input
                value={newPlaylist}
                onChange={e => setNewPlaylist(e.target.value)}
                className="flex-1 border px-3 py-2 rounded text-sm"
                placeholder="Create playlist"
              />
              <button className="bg-black text-white px-3 rounded">
                Create
              </button>
            </form>

            {playlists.map(pl => (
              <button
                key={pl._id}
                onClick={() => addToPlaylist(pl._id)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100 text-sm"
              >
                <PlaylistCover songs={pl.songs} />
                <span className="truncate">{pl.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration || 0);
          setProgress(
            (audioRef.current.currentTime /
              audioRef.current.duration) *
            100 || 0
          );
        }}
        onEnded={() => {
          if (loop) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            next();
          }
        }}
      />
    </>
  );
}