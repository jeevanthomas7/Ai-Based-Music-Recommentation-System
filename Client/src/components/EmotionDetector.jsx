import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { getEmotionRecommendations } from "../api/emotionService";
import { FiVideo, FiVideoOff, FiActivity, FiSmile } from "react-icons/fi";

export default function EmotionDetector({ onSongs }) {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  const [emotion, setEmotion] = useState("Waiting...");
  const [status, setStatus] = useState("Starting camera...");
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        await new Promise(r => {
          if (videoRef.current) videoRef.current.onloadedmetadata = r;
          else r();
        });

        setStatus("Loading Models...");
        const MODEL_URL = "/models";
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        setStatus("Scanning Emotion...");
        intervalRef.current = setInterval(detectEmotion, 5000);
      } catch (err) {
        console.error(err);
        setStatus("Access Denied");
      }
    };

    init();

    const stopOnBack = () => stopCamera();
    window.addEventListener("STOP_CAMERA", stopOnBack);

    return () => {
      window.removeEventListener("STOP_CAMERA", stopOnBack);
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
    setStatus("Camera Paused");
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startCamera = async () => {
    if (cameraOn) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
      setStatus("Scanning Emotion...");
      intervalRef.current = setInterval(detectEmotion, 5000);
    } catch (err) {
      setStatus("Access Denied");
    }
  };

  const detectEmotion = async () => {
    if (!videoRef.current || !cameraOn) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceExpressions();

    if (!detection) {
      setEmotion("No face");
      return;
    }

    const expressions = detection.expressions;
    const mood = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );

    setEmotion(mood);

    const data = await getEmotionRecommendations(mood);
    onSongs(data.songs || []);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiVideo className="text-sky-500" /> Live Feed
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-[10px] font-bold uppercase tracking-wider">
          <span className={`w-1.5 h-1.5 rounded-full ${cameraOn ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
          {status}
        </div>
      </div>

      <div className="relative aspect-video rounded-3xl bg-gray-900 overflow-hidden border-4 border-gray-50 shadow-inner group">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-700 ${cameraOn ? 'opacity-100' : 'opacity-30'}`}
        />

        {cameraOn && (
          <>
            <div className="absolute inset-0 pointer-events-none border-[1px] border-sky-400/20 m-4 rounded-xl" />
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-sky-500 m-8 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-sky-500 m-8 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-sky-500 m-8 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-sky-500 m-8 rounded-br-lg" />

            <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-scan" />
          </>
        )}

        {!cameraOn && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-2">
            <FiVideoOff size={48} className="opacity-20" />
            <p className="text-sm font-bold opacity-40 uppercase tracking-widest">Feed Disabled</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100/50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Mood</p>
          <div className="flex items-center gap-2">
            <FiSmile className="text-emerald-500" />
            <span className="text-lg font-black text-gray-900 capitalize">{emotion}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100/50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Signal Strength</p>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4].map(i => <div key={i} className={`h-1.5 w-6 rounded-full ${cameraOn ? 'bg-sky-500' : 'bg-gray-200'}`} />)}
          </div>
        </div>
      </div>

      <div className="mt-8">
        {cameraOn ? (
          <button
            onClick={stopCamera}
            className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <FiVideoOff /> Disable Camera
          </button>
        ) : (
          <button
            onClick={startCamera}
            className="w-full py-4 rounded-2xl bg-sky-600 text-white font-bold hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <FiVideo /> Enable Camera
          </button>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}} />
    </div>
  );
}
