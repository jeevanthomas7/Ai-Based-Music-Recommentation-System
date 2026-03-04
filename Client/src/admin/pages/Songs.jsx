import { useEffect, useState } from "react";
import API from "../../api/api";
import SongForm from "../components/SongForm";
import { FiEdit3, FiTrash2, FiAlertCircle, FiCheck } from "react-icons/fi";

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [status, setStatus] = useState({ type: "", msg: "" });

  function load() {
    API.get("/songs").then(r => setSongs(r.data));
  }

  useEffect(load, []);

  async function removeSong() {
    try {
      await API.delete(`/admin/songs/${confirmId}`);
      setConfirmId(null);
      showStatus("success", "Song Permanently Deleted");
      load();
    } catch (e) {
      showStatus("error", "Failed to Delete Song");
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
          Library <span className="text-sky-600">Management</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">Manage and curate your musical database</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40">
          <SongForm
            editData={editing}
            onSaved={() => {
              setEditing(null);
              load();
              showStatus("success", editing ? "Entry Sync Successful" : "New Entry Added");
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black italic tracking-widest text-gray-400 uppercase">Tracklist Registry</h3>
            <span className="text-[10px] font-black italic text-sky-600">{songs.length} TOTAL</span>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 divide-y divide-gray-50 overflow-hidden">
            {songs.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-[10px] font-black italic tracking-widest text-gray-300 uppercase">Registry Is Empty</p>
              </div>
            )}

            {songs.map(s => (
              <div
                key={s._id}
                className="group flex items-center justify-between gap-4 p-5 hover:bg-gray-50/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={s.coverUrl}
                      className="w-14 h-14 rounded-2xl object-cover bg-gray-100 shadow-md group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
                  </div>

                  <div>
                    <div className="font-black italic tracking-tighter text-gray-900 uppercase text-sm leading-tight mb-0.5">
                      {s.title}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {s.artist}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(s)}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white hover:shadow-lg transition-all active:scale-90"
                    title="Edit Track"
                  >
                    <FiEdit3 size={16} />
                  </button>

                  <button
                    onClick={() => setConfirmId(s._id)}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white hover:shadow-lg transition-all active:scale-90"
                    title="Remove Track"
                  >
                    <FiTrash2 size={16} />
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
              This will permanently remove the track from our global registry. This action is final.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black italic tracking-widest uppercase bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={removeSong}
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
