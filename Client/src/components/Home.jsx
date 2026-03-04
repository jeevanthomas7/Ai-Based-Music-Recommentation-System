import React, { useEffect, useState } from "react";
import API from "../api/api.js";
import { FiPlay, FiSearch, FiX, FiZap } from "react-icons/fi";

function Card({ img, title, subtitle, onPlay }) {
  return (
    <div className="w-[160px] sm:w-[190px] flex-shrink-0 group cursor-pointer">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl shadow-gray-200/50 group-hover:shadow-2xl group-hover:shadow-sky-100 transition-all duration-500 group-hover:-translate-y-2">
        {img ? (
          <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <FiSearch className="text-gray-300" size={32} />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

        <button
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          className="absolute right-4 bottom-4 w-12 h-12 rounded-2xl
          bg-white text-gray-900 flex items-center justify-center
          opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl hover:bg-sky-500 hover:text-white"
        >
          <FiPlay size={20} className="ml-0.5" />
        </button>
      </div>

      <div className="mt-4 px-1">
        <div className="text-[11px] sm:text-[13px] font-black italic text-gray-900 truncate tracking-tighter uppercase">{title}</div>
        {subtitle && (
          <div className="text-[8px] sm:text-[9px] font-black italic text-gray-400 truncate uppercase tracking-widest mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

function normalizeTrack(t) {
  if (!t) return null;
  return {
    id: t._id || t.id,
    title: t.title || t.name || "",
    artist: Array.isArray(t.artist) ? t.artist.join(", ") : t.artist || "",
    cover: t.coverUrl || t.cover || t.image || "",
    url: t.audioUrl || t.audio || t.stream || ""
  };
}

function normalizeList(res, key) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res[key] && Array.isArray(res[key])) return res[key];
  return [];
}

export default function Home({ setQueue, setCurrentIndex }) {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [madeForYou, setMadeForYou] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [tRes, aRes, fRes, mRes] = await Promise.all([
          API.get("/songs/trending"),
          API.get("/albums"),
          API.get("/songs/featured"),
          API.get("/songs/made-for-you")
        ]);

        if (!mounted) return;

        setTrending(normalizeList(tRes.data, "songs").map(normalizeTrack));
        setAlbums(normalizeList(aRes.data, "albums"));
        setFeatured(normalizeList(fRes.data, "songs").map(normalizeTrack));
        setMadeForYou(normalizeList(mRes.data, "songs").map(normalizeTrack));
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  function playTracks(tracks, index = 0) {
    const playable = tracks.filter(t => t?.url);
    if (!playable.length) return;
    setQueue(playable);
    setCurrentIndex(index);
  }

  async function playAlbum(album) {
    try {
      const res = await API.get(`/albums/${album._id}`);
      const songs = (res.data?.songs || [])
        .map(s => ({
          id: s._id,
          title: s.title,
          artist: Array.isArray(s.artist)
            ? s.artist.join(", ")
            : s.artist || album.artist || "",
          cover: s.coverUrl || album.coverUrl || "",
          url: s.audioUrl || s.audio || s.stream || ""
        }))
        .filter(s => s.url);

      if (!songs.length) return;
      setQueue(songs);
      setCurrentIndex(0);
    } catch (e) {
      console.error(e);
    }
  }

  const filterTracks = (list) =>
    list.filter(
      (item) =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.artist?.toLowerCase().includes(search.toLowerCase())
    );

  const filterAlbums = (list) =>
    list.filter(
      (item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.artist?.toLowerCase().includes(search.toLowerCase())
    );

  const sectionLayout = search
    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
    : "flex gap-4 overflow-x-auto pb-2 scrollbar-hide";

  return (
    <div className="relative">
      <div className="sticky top-[70px] md:top-[80px] z-30 mb-8 px-1">
        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl shadow-xl shadow-gray-200/60 flex items-center gap-3 transition-all duration-500">

          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
            {["all", "featured", "albums"].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black italic tracking-tighter uppercase whitespace-nowrap transition-all duration-300 ${activeFilter === f
                  ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-100 flex-shrink-0 hidden sm:block" />

          <div className="relative w-full md:flex-1 group">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-400 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search by track, artist, or album..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-11 py-2.5 rounded-full bg-white border border-sky-100 shadow-md shadow-sky-100/40
              focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-50 transition-all text-xs font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-7 pb-28 px-4 md:px-6 pt-2 md:pt-4">

        {(activeFilter === "all") && (
          <>
            <section>
              <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-gray-900 mb-4">Trending</h2>
              <div className={sectionLayout}>
                {loading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : (
                  filterTracks(trending).map((s, i) => (
                    <Card
                      key={s.id}
                      img={s.cover}
                      title={s.title}
                      subtitle={s.artist}
                      onPlay={() => playTracks(filterTracks(trending), i)}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Premium Ad Banner (Only for non-premium) */}
            {(() => {
              try {
                const u = JSON.parse(localStorage.getItem("dotin_user"));
                if (u?.isPremium) return null;
                return (
                  <div className="relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 to-emerald-400/5 rounded-[2.5rem] -z-10" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2.5rem] border border-sky-100 bg-white shadow-xl shadow-sky-100/20">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-lg">
                          <FiZap size={24} className="fill-current" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black italic tracking-tighter uppercase text-gray-900 leading-tight">Escape the noise. <span className="text-sky-600">Go Premium</span></h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ad-free listening • Exclusive AI • Lossless Audio</p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.location.href = "/premium"}
                        className="px-8 py-3.5 rounded-2xl bg-gray-900 text-white text-[11px] font-black italic tracking-widest uppercase hover:bg-black hover:scale-105 transition-all shadow-xl shadow-gray-200"
                      >
                        Upgrade Now
                      </button>
                      <div className="absolute top-4 right-6 text-[8px] font-black text-sky-300 uppercase tracking-widest pointer-events-none opacity-50">SPONSORED</div>
                    </div>
                  </div>
                );
              } catch {
                return null;
              }
            })()}

            <section>
              <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-gray-900 mb-4">Made for you</h2>
              <div className={sectionLayout}>
                {filterTracks(madeForYou).map((s, i) => (
                  <Card
                    key={s.id}
                    img={s.cover}
                    title={s.title}
                    subtitle={s.artist}
                    onPlay={() => playTracks(filterTracks(madeForYou), i)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {(activeFilter === "all" || activeFilter === "featured") && (
          <section>
            <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-gray-900 mb-4">Featured</h2>
            <div className={sectionLayout}>
              {filterTracks(featured).map((s, i) => (
                <Card
                  key={s.id}
                  img={s.cover}
                  title={s.title}
                  subtitle={s.artist}
                  onPlay={() => playTracks(filterTracks(featured), i)}
                />
              ))}
            </div>
          </section>
        )}

        {(activeFilter === "all" || activeFilter === "albums") && (
          <section>
            <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-gray-900 mb-4">Albums</h2>
            <div className={sectionLayout}>
              {filterAlbums(albums).map(a => (
                <Card
                  key={a._id}
                  img={a.coverUrl}
                  title={a.name}
                  subtitle={a.artist}
                  onPlay={() => playAlbum(a)}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}