import { FiMusic, FiPlay } from "react-icons/fi";

export default function MoodPlaylist({ songs, onPlay }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <FiMusic className="text-emerald-500" /> Vibe Selection
        </h2>
        <span className="text-[10px] font-extrabold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">
          {songs.length} Tracks Found
        </span>
      </div>

      {songs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
            <FiMusic size={40} />
          </div>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Awaiting Mood Data</p>
          <p className="text-gray-400 text-sm mt-2">The AI will curate a playlist once a mood is detected.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[600px]">
          <div className="grid sm:grid-cols-2 gap-4 pb-4">
            {songs.map(song => (
              <div
                key={song._id}
                onClick={() => onPlay(song)}
                className="group relative bg-gray-50 rounded-3xl p-4 border border-gray-100/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-md">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); onPlay(song); }}
                    className="absolute bg-sky-500 text-white flex items-center justify-center shadow-xl transition-all duration-500 active:scale-95 z-10
                    opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                    lg:top-auto lg:left-auto lg:right-3 lg:bottom-3 lg:translate-x-0 lg:translate-y-0 lg:w-11 lg:h-11 lg:rounded-2xl"
                  >
                    <FiPlay className="fill-current" size={16} />
                  </button>
                </div>

                <div className="relative">
                  <h3 className="font-bold text-gray-900 truncate pr-2 group-hover:text-emerald-600 transition-colors uppercase text-[11px] tracking-tight">{song.title}</h3>
                  <p className="text-[10px] text-gray-500 font-bold truncate uppercase opacity-60 tracking-wider">{song.artist}</p>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase">Vibe</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}} />
    </div>
  );
}
