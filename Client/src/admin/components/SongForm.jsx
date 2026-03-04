import { useEffect, useState } from "react";
import API from "../../api/api";
import { FiMusic, FiImage, FiPlus, FiSave, FiX } from "react-icons/fi";

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

export default function SongForm({ editData = null, onSaved }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [genre, setGenre] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/albums").then(r => setAlbums(r.data));
  }, []);

  useEffect(() => {
    if (!editData) return;
    setTitle(editData.title || "");
    setArtist(editData.artist || "");
    setAlbumId(editData.album?._id || editData.album);
    setGenre(editData.genre || "");
  }, [editData]);

  function validate() {
    if (!title.trim()) return "Song title is required";
    if (!albumId) return "Album is required";
    if (!editData && !audioFile) return "Audio file is required";
    if (audioFile && audioFile.size > 25 * 1024 * 1024)
      return "Audio file must be under 25MB";
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
      form.append("albumId", albumId);
      form.append("genre", genre);
      if (imageFile) form.append("imageFile", imageFile);
      if (audioFile) form.append("audioFile", audioFile);

      if (editData) {
        await API.put(`/admin/song/${editData._id}`, form);
      } else {
        await API.post("/admin/songs", form);
      }

      reset();
      onSaved?.();
      alert(editData ? "Song updated successfully" : "Song added successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTitle("");
    setArtist("");
    setAlbumId("");
    setGenre("");
    setImageFile(null);
    setAudioFile(null);
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-8 w-full"
    >
      <div>
        <h2 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase">
          {editData ? "Refine" : "Register"} <span className="text-sky-600">Track</span>
        </h2>
        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">
          Sync high-fidelity audio and assets to registry
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
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase ml-1">Track Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Moonlight Sonata"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-gray-900 placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-sky-100 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase ml-1">Artist Name</label>
          <input
            value={artist}
            onChange={e => setArtist(e.target.value)}
            placeholder="e.g. Beethoven"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-gray-900 placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-sky-100 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase ml-1">Collection *</label>
          <select
            value={albumId}
            onChange={e => setAlbumId(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-sky-100 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Album</option>
            {albums.map(a => (
              <option key={a._id} value={a._id}>
                {a.title.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase ml-1">Genre Class</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 group hover:bg-white hover:border-sky-100 transition-all duration-300">
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase mb-3 block">Audio Master {editData ? "" : "*"}</label>
          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={e => setAudioFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-sky-600 shadow-sm group-hover:bg-sky-50 transition-colors">
                <FiMusic size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black italic uppercase tracking-tighter text-gray-900 truncate">
                  {audioFile ? audioFile.name : "Select Audio File"}
                </p>
                <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">MP3 / WAV / FLAC MAX 25MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 group hover:bg-white hover:border-sky-100 transition-all duration-300">
          <label className="text-[9px] font-black italic tracking-widest text-gray-400 uppercase mb-3 block">Visual Art</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-50 transition-colors">
                <FiImage size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black italic uppercase tracking-tighter text-gray-900 truncate">
                  {imageFile ? imageFile.name : "Select Image Asset"}
                </p>
                <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">JPG / PNG / WEBP</p>
              </div>
            </div>
          </div>
          {imageFile && (
            <div className="mt-4 relative inline-block">
              <img
                src={URL.createObjectURL(imageFile)}
                className="w-20 h-20 rounded-2xl object-cover shadow-lg ring-4 ring-white"
                alt="preview"
              />
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          disabled={loading}
          className="group relative px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] overflow-hidden shadow-2xl shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 text-[11px] font-black italic tracking-widest uppercase">
            {loading ? "Processing..." : editData ? "Sync Changes" : "Register Track"}
          </span>
        </button>
      </div>
    </form>
  );
}
