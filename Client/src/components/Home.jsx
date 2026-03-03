import React, { useEffect, useState } from "react";
import API from "../api/api.js";
import { FiPlay, FiSearch, FiX } from "react-icons/fi";

function Card({ img, title, subtitle, onPlay }) {
  return (
    <div className="w-[160px] sm:w-[176px] flex-shrink-0">
      <div className="relative group rounded-xl overflow-hidden bg-[#0f0f0f]
        shadow-[0_6px_18px_rgba(59,130,246,0.08)]
        hover:shadow-[0_10px_30px_rgba(59,130,246,0.18)]
        transition">
        <div className="w-full aspect-square bg-gray-800">
          {img ? (
            <img src={img} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
          )}
        </div>

        <button
          onClick={onPlay}
          className="absolute right-3 bottom-3 w-9 h-9 rounded-full
          bg-white text-black flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition shadow-md"
        >
          <FiPlay />
        </button>
      </div>

      <div className="mt-3">
        <div className="text-sm font-semibold truncate">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-400 truncate">{subtitle}</div>
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
    <div>
      <div className="sticky top-16 z-30 bg-[#f7f7f8] border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-4 py-3">

            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {["all", "featured", "albums"].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm whitespace-nowrap transition ${
                    activeFilter === f
                      ? "bg-black text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative w-full md:flex-1">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search songs, albums..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-full border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-lg"
                >
                  <FiX />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="space-y-7 pb-28 px-4 md:px-6 pt-4">

        {(activeFilter === "all") && (
          <>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Trending</h2>
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

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Made for you</h2>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Featured</h2>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Albums</h2>
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