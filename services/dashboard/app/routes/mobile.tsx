import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { getCompanies } from "../../db/gen/ts/companies_sql";
import client from "../db";
import { createServerFn } from "@tanstack/react-start";

const getInvestments = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await client.connect().catch(() => {});
    const rows = await getCompanies(client);
    const companies = rows.map((c) => ({ id: c.slug, name: c.name }));
    return { companies };
  } catch (error) {
    console.error("Error loading companies for mobile page", error);
    return { companies: [] as { id: string; name: string }[] };
  }
});

export const Route = createFileRoute("/mobile")({
  component: MobileRecorderPage,
  loader: async () => {
    return getInvestments();
  },
});

function MobileRecorderPage() {
  const { companies } = Route.useLoaderData() as {
    companies: { id: string; name: string }[];
  };

  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [level, setLevel] = useState(0);

  const startRecording = async () => {
    if (recording || !selectedCompany) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // ------ WebAudio analyser for real-time levels ------
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const tick = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
          const avg = sum / bufferLength;
          // Normalize 0-1 (dataArray elements 0-255)
          setLevel(avg / 255);
          animationIdRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch (e) {
        console.warn("AudioContext init failed", e);
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());

        // cleanup analyser/audio context
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
        audioContextRef.current?.close();
        audioContextRef.current = null;
        analyserRef.current = null;
        setLevel(0);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  };

  const stopRecording = () => {
    if (!recording) return;
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const isCompanySelected = Boolean(
    selectedCompany && companies.find((c) => c.id === selectedCompany)
  );

  console.log("Companies loaded:", companies);
  console.log("Selected company:", selectedCompany);

  return (
    <div className="flex flex-col items-center h-[100dvh] bg-neutral-100 dark:bg-neutral-900 p-4 gap-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 text-center">
        Deal Team Highlight (Mobile)
      </h1>

      {/* Company selector */}
      <div className="w-full max-w-md">
        <label
          htmlFor="companySelect"
          className="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {selectedCompany ? "Selected Company" : "Choose Investment"}
        </label>
        <select
          id="companySelect"
          value={selectedCompany ?? ""}
          onChange={(e) => setSelectedCompany(e.target.value || null)}
          className="w-full p-3 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            -- Select investment --
          </option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Recording controls */}
      {isCompanySelected && (
        <>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm">
            Recording for:{" "}
            {companies.find((c) => c.id === selectedCompany)?.name}
          </p>
          <div className="relative flex items-center justify-center">
            {/* Expanding wave ring */}
            {recording && (
              <span
                className="absolute inset-0 rounded-full border-4 border-red-500 dark:border-red-400 pointer-events-none"
                style={{
                  transform: `scale(${1 + level * 1.5})`,
                  opacity: Math.min(level + 0.3, 1),
                  transition: "transform 0.05s linear, opacity 0.1s linear",
                }}
              />
            )}

            <button
              onClick={recording ? stopRecording : startRecording}
              className={`flex items-center justify-center rounded-full h-24 w-24 transition-transform duration-75 ${recording ? "bg-red-500" : "bg-green-600"} text-white text-lg focus:outline-none`}
              style={recording ? { transform: `scale(${1 + level})` } : undefined}
            >
              {recording ? "Stop" : "Rec"}
            </button>
          </div>

          {audioUrl && (
            <audio className="mt-6 w-full max-w-md" controls src={audioUrl} />
          )}
        </>
      )}
    </div>
  );
}
