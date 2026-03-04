import { useEffect, useState } from "react";
import API from "../../api/api";
import { FiImage, FiPlus, FiSave, FiX } from "react-icons/fi";

const GENRES = [
  "Pop",
  "Hip Hop",
  "Rock",
  "Jazz",
  "Classical",
  "Electronic",
  "Sad",
  "Romantic",
  "Lo-Fi",
  "Instrumental"
];

export default function AlbumForm({ editData = null, onSaved }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editData) return;
    setTitle(editData.title || "");
    setArtist(editData.artist || "");
    setYear(editData.year || "");
    setGenre(editData.genre || "");
    setImageFile(null);
  }, [editData]);

  function validate() {
    if (!title.trim()) return "Album title is required";
    if (!artist.trim()) return "Artist is required";
    return "";
  }

  async function submit(e) {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("artist", artist);
      form.append("year", year);
      form.append("genre", genre);
      if (imageFile) form.append("imageFile", imageFile);

      if (editData) {
        await API.put(`/admin/album/${editData._id}`, form);
      } else {
        await API.post("/admin/albums", form);
      }

      reset();
      onSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTitle("");
    setArtist("");
    setYear("");
    setGenre("");
    setImageFile(null);
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-8 w-full"
    >
      <div>
        <h2 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase">
          {editData ? "Refine" : "Establish"} <span className="text-sky-600">Collection</span>
        </h2>
        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">
          Define new musical umbrellas for your tracks
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase ml-1">Album Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Vintage Echoes"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-gray-900 placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-sky-100 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase ml-1">Artist Lead *</label>
          <input
            value={artist}
            onChange={e => setArtist(e.target.value)}
            placeholder="e.g. various artists"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-gray-900 placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-sky-100 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase ml-1">Chronology Year</label>
          <input
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="2024"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-gray-900 placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-sky-100 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase ml-1">Primary Genre</label>
          <select
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-sky-100 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Genre</option>
            {GENRES.map(g => (
              <option key={g} value={g}>
                {g.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 group hover:bg-white hover:border-sky-100 transition-all duration-300">
        <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase mb-4 block">Visual Identity art</label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex items-center gap-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-emerald-600 shadow-md group-hover:bg-emerald-50 transition-colors">
              <FiImage size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black italic uppercase tracking-tighter text-gray-900 truncate">
                {imageFile ? imageFile.name : "Select Album Cover"}
              </p>
              <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">JPG / PNG / WEBP HIGH QUALITY</p>
            </div>
          </div>
        </div>

        {(imageFile || editData?.coverUrl) && (
          <div className="mt-6 flex gap-4 animate-in fade-in duration-500">
            {imageFile ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(imageFile)}
                  className="w-32 h-32 rounded-3xl object-cover shadow-2xl ring-4 ring-white"
                  alt="new preview"
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-emerald-500 text-[8px] font-black text-white uppercase shadow-lg">New Selection</div>
              </div>
            ) : editData?.coverUrl ? (
              <div className="relative">
                <img
                  src={editData.coverUrl}
                  className="w-32 h-32 rounded-3xl object-cover shadow-xl opacity-80"
                  alt="current cover"
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-gray-900/50 text-[8px] font-black text-white uppercase backdrop-blur-sm">Current Asset</div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          disabled={loading}
          className="group relative px-12 py-4 bg-gray-900 text-white rounded-[1.5rem] overflow-hidden shadow-2xl shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 text-[11px] font-black italic tracking-widest uppercase">
            {loading ? "Saving Cluster..." : editData ? "Establish Sync" : "Deploy Collection"}
          </span>
        </button>
      </div>
    </form>
  );
}
