import { useEffect, useState } from "react";
import API from "../../api/api";
import AlbumForm from "../components/AlbumForm";
import { FiEdit3, FiTrash2, FiAlertCircle, FiCheck } from "react-icons/fi";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const load = async () => {
    try {
      const res = await API.get("/albums");
      setAlbums(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function removeAlbum() {
    try {
      await API.delete(`/admin/albums/${confirmId}`);
      setConfirmId(null);
      showStatus("success", "Album Permanently Erased");
      load();
    } catch (e) {
      showStatus("error", "Failed to Delete Album");
    }
  }

  function showStatus(type, msg) {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase text-gray-900">
          Collection <span className="text-sky-600">Curator</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">Manage your albums and musical collections</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40">
          <AlbumForm
            editData={editing}
            onSaved={() => {
              setEditing(null);
              load();
              showStatus("success", editing ? "Entry Sync Successful" : "New Collection Added");
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black italic tracking-widest text-gray-400 uppercase">Album Archive</h3>
            <span className="text-[10px] font-black italic text-sky-600">{albums.length} TOTAL</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {albums.length === 0 && (
              <div className="col-span-full p-20 text-center bg-white rounded-[2.5rem] border border-gray-100">
                <p className="text-[10px] font-black italic tracking-widest text-gray-300 uppercase">Archive Is Empty</p>
              </div>
            )}

            {albums.map(a => (
              <div
                key={a._id}
                className="group bg-white p-4 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative mb-4">
                  <img
                    src={a.coverUrl || "/placeholder.png"}
                    className="w-full aspect-square rounded-[1.5rem] object-cover bg-gray-100 shadow-md group-hover:scale-[1.02] transition-all duration-500"
                  />
                  <div className="absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-black/5" />
                </div>

                <div className="px-1">
                  <div className="font-black italic tracking-tighter text-gray-900 uppercase text-xs leading-tight mb-0.5 truncate">
                    {a.title}
                  </div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">
                    {a.artist}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => setEditing(a)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all active:scale-90 flex items-center justify-center gap-2 "
                  >
                    <FiEdit3 size={14} />
                    <span className="text-[9px] font-black italic uppercase tracking-widest">Edit</span>
                  </button>

                  <button
                    onClick={() => setConfirmId(a._id)}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                    title="Remove Album"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
              <FiAlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black italic tracking-tighter text-gray-900 uppercase">
              Confirm <span className="text-red-500">Erasure</span>
            </h3>
            <p className="text-[11px] font-bold text-gray-400 mt-2 leading-relaxed uppercase tracking-wider">
              This will permanently remove the collection and its track associations. This action is final.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black italic tracking-widest uppercase bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={removeAlbum}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black italic tracking-widest uppercase bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-200 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Notifications */}
      {status.msg && (
        <div className="fixed bottom-8 right-8 z-[110] animate-in slide-in-from-right-10 duration-500">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500 border-emerald-400' : 'bg-red-500 border-red-400'}`}>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              {status.type === 'success' ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
            </div>
            <p className="text-[10px] font-black italic tracking-widest uppercase text-white">{status.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
