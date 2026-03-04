import React, { useState, useEffect } from "react";
import { FiHeart, FiMusic, FiTrash2, FiX, FiHome, FiCompass, FiInfo } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

function normalizeSong(s) {
  if (!s) return null;
  return {
    id: s._id,
    title: s.title,
    artist: Array.isArray(s.artist) ? s.artist.join(", ") : s.artist || "",
    cover: s.coverUrl || s.cover || s.image || "",
    url: s.audioUrl || s.audio || s.stream || ""
  };
}

function PlaylistPreview({ songs = [] }) {
  const covers = songs.filter(s => s?.coverUrl).slice(0, 4);

  if (covers.length === 0) {
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md">
        <FiMusic className="text-gray-500" />
      </div>
    );
  }

  if (covers.length === 1) {
    return (
      <img
        src={covers[0].coverUrl}
        className="w-10 h-10 rounded-md object-cover"
        alt=""
      />
    );
  }

  if (covers.length === 2) {
    return (
      <div className="w-10 h-10 flex rounded-md overflow-hidden">
        {covers.map((s, i) => (
          <img
            key={i}
            src={s.coverUrl}
            className="w-1/2 h-full object-cover"
            alt=""
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 grid grid-cols-2 grid-rows-2 rounded-md overflow-hidden">
      {covers.map((s, i) => (
        <img
          key={i}
          src={s.coverUrl}
          className="w-full h-full object-cover"
          alt=""
        />
      ))}
    </div>
  );
}

export default function Sidebar({ user, onPlay, isOpen, onClose }) {
  const [favourites, setFavourites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [openPlaylist, setOpenPlaylist] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    loadFavourites();
    loadPlaylists();

    const refetch = () => {
      loadFavourites();
      loadPlaylists();
    };

    window.addEventListener("dotin_playlists_changed", refetch);
    window.addEventListener("dotin_favourites_changed", refetch);

    return () => {
      window.removeEventListener("dotin_playlists_changed", refetch);
      window.removeEventListener("dotin_favourites_changed", refetch);
    };
  }, [userId]);

  async function loadFavourites() {
    try {
      const res = await API.get(`/favorites/user/${userId}`);
      setFavourites(res.data || []);
    } catch (err) {
      console.error("Load favourites failed", err);
    }
  }

  async function loadPlaylists() {
    try {
      const res = await API.get(`/playlists/user/${userId}`);
      setPlaylists(res.data || []);
    } catch (err) {
      console.error("Load playlists failed", err);
    }
  }

  function askConfirm(message, action) {
    setConfirm({ message, action });
  }

  async function confirmYes() {
    if (confirm?.action) await confirm.action();
    setConfirm(null);
  }

  function confirmNo() {
    setConfirm(null);
  }

  const go = (path) => {
    navigate(path);
    if (window.innerWidth < 768) onClose();
  };

  const SidebarContent = (
    <div className="h-full bg-[#f9f9fb] border-r border-gray-100 flex flex-col overflow-hidden shadow-[4px_0_24px_0_rgba(0,0,0,0.06)] rounded-r-3xl">
      {/* Header for mobile view */}
      <div className="md:hidden px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
        <span className="font-extrabold text-xl text-gray-900 italic">DOT<span className="text-sky-600">IN</span></span>
        <button onClick={onClose} className="p-2 rounded-xl bg-gray-50 text-gray-600 active:scale-95 transition-all">
          <FiX size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        {/* Header Section */}
        <div className="px-2 mb-2 flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Your Library</h2>
          <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
        </div>

        {/* Favourites Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between px-1 mb-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <FiHeart className="text-pink-500" /> Favourites
            </div>
            {favourites.length > 3 && (
              <button onClick={() => navigate("/favorites")} className="text-[10px] font-bold text-sky-600 uppercase hover:text-sky-700 transition-colors">View All</button>
            )}
          </div>

          <div className="space-y-1">
            {favourites.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-2">
                  <FiHeart className="text-pink-200" size={18} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">No favourites</p>
              </div>
            ) : (
              favourites.slice(-4).reverse().map(f => (
                <div key={f._id} className="group flex items-center justify-between px-2 py-2 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                  <div onClick={() => onPlay?.([normalizeSong(f.songId)], 0)} className="flex items-center gap-3 cursor-pointer min-w-0">
                    <img src={f.songId?.coverUrl} className="w-9 h-9 rounded-xl object-cover shadow-sm bg-gray-100" alt="" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate leading-tight group-hover:text-sky-600 transition-colors">{f.songId?.title}</div>
                      <div className="text-[9px] text-gray-500 font-medium truncate leading-tight mt-0.5">{Array.isArray(f.songId?.artist) ? f.songId.artist.join(", ") : f.songId?.artist}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => askConfirm(`Remove "${f.songId.title}" from favourites?`, async () => {
                      await API.post("/favorites/remove", { userId, songId: f.songId._id });
                      window.dispatchEvent(new Event("dotin_favourites_changed"));
                    })}
                    className="p-1.5 opacity-0 group-hover:opacity-100 rounded-lg bg-red-50 text-red-400 hover:text-red-600 transition-all"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Playlists Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between px-1 mb-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <FiMusic className="text-sky-500" /> Playlists
            </div>
            {playlists.length > 3 && (
              <button onClick={() => navigate("/playlists")} className="text-[10px] font-bold text-sky-600 uppercase hover:text-sky-700 transition-colors">View All</button>
            )}
          </div>

          <div className="space-y-2">
            {playlists.length === 0 ? (
              <div className="py-8 text-center font-bold text-[10px] text-gray-300 uppercase tracking-widest">
                No playlists created
              </div>
            ) : (
              playlists.slice(-4).reverse().map(pl => (
                <div key={pl._id} className="space-y-1">
                  <div
                    onClick={() => setOpenPlaylist(openPlaylist === pl._id ? null : pl._id)}
                    className={`group flex items-center justify-between px-2 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer ${openPlaylist === pl._id ? 'bg-sky-50/50 ring-1 ring-sky-100' : 'hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlaylistPreview songs={pl.songs} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">{pl.name}</div>
                        <div className="text-[9px] text-gray-400 font-medium leading-tight">{pl.songs.length} tracks</div>
                      </div>
                    </div>
                    <FiTrash2
                      onClick={(e) => {
                        e.stopPropagation();
                        askConfirm(`Delete playlist "${pl.name}"?`, async () => {
                          await API.delete(`/playlists/${pl._id}`);
                          window.dispatchEvent(new Event("dotin_playlists_changed"));
                        });
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                      size={14}
                    />
                  </div>

                  {openPlaylist === pl._id && (
                    <div className="pl-4 mt-2 mb-4 space-y-1 border-l-2 border-sky-100 ml-5 animate-in slide-in-from-top-2 duration-300">
                      {pl.songs.slice(0, 6).map((s, i) => (
                        <div key={s._id} className="group flex items-center justify-between p-1.5 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                          <div
                            onClick={() => onPlay?.(pl.songs.map(normalizeSong), i)}
                            className="flex items-center gap-2 cursor-pointer min-w-0 flex-1"
                          >
                            <img src={s.coverUrl} className="w-6 h-6 rounded-lg object-cover shadow-xs" alt="" />
                            <span className="truncate text-[10px] font-bold text-gray-600 group-hover:text-sky-600 transition-colors">
                              {s.title}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              askConfirm(`Remove "${s.title}" from playlist?`, async () => {
                                await API.post("/playlists/remove-song", { playlistId: pl._id, songId: s._id });
                                window.dispatchEvent(new Event("dotin_playlists_changed"));
                              });
                            }}
                            className="p-1 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                          >
                            <FiTrash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed top-14 md:top-16 bottom-20 left-0 w-80 hidden md:block z-30 transition-all duration-500">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <aside
          className={`relative w-80 h-full bg-[#f9f9fb] shadow-2xl transition-transform duration-500 ${isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {SidebarContent}
        </aside>
      </div>

      {/* Delete Confirmation Modal */}
      {confirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-[320px] p-6 shadow-2xl transform animate-in zoom-in duration-300">
            <div className="text-base font-bold text-gray-900 mb-2">Are you sure?</div>
            <div className="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
              {confirm.message}
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmNo}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmYes}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}