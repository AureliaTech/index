import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";
import { getInvestments } from "../functions/company";
import { createDealTeamHighlight } from "../functions/deal-team-highlights";
import { Plus } from "lucide-react";

// Transcribe base64-encoded audio using Deepgram. Also store the raw audio under app/data/<company>/
const transcribeAudio = createServerFn({ method: "POST" })
  .validator((d: { company: string; audio: string }) => d)
  .handler(async ({ data }) => {
    const deepgramApiKey = "1ef67c5c25cddaf371b114e1305508e429ca1b5b"; // TODO: move to env or secret manager

    try {
      const { company, audio } = data;
      const buf = Buffer.from(audio, "base64");

      // Persist audio file so we have a reference later
      const dir = `app/data/${company}`;
      await fs.mkdir(dir, { recursive: true });
      const filename = `audio-${Date.now()}.webm`;
      const filepath = `${dir}/${filename}`;
      await fs.writeFile(filepath, buf);

      // Dynamically import SDK only on server to avoid bundling in client
      const { createClient } = await import("@deepgram/sdk");
      const deepgram = createClient(deepgramApiKey);

      const { result, error } =
        await deepgram.listen.prerecorded.transcribeFile(buf, {
          model: "nova-3",
          language: "multi",
        });

      if (error) throw error;

      const transcript: string = (
        result?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? ""
      ).trim();

      return { transcript, audioPath: filepath };
    } catch (err: any) {
      console.error("Deepgram transcription error", err);
      return { transcript: "", error: err?.message ?? "unknown" };
    }
  });

// The logic previously handled by `saveComment` is now managed by the
// `createDealTeamHighlight` server function inside
// ../functions/deal-team-highlights.

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
  const recordedBlobRef = useRef<Blob | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [level, setLevel] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
        const audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
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
        recordedBlobRef.current = blob;
        stream.getTracks().forEach((track) => track.stop());

        // cleanup analyser/audio context
        if (animationIdRef.current)
          cancelAnimationFrame(animationIdRef.current);
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

  const handleSave = async () => {
    if (!recordedBlobRef.current || isSaving || !selectedCompany) return;
    setIsSaving(true);
    try {
      const arrayBuff = await recordedBlobRef.current.arrayBuffer();
      const base64 = btoa(
        Array.from(new Uint8Array(arrayBuff))
          .map((b) => String.fromCharCode(b))
          .join("")
      );

      const { transcript, error } = await transcribeAudio({
        data: { company: selectedCompany, audio: base64 },
      } as any);

      if (error || !transcript) {
        console.error("Transcription failed", error);
        setIsSaving(false);
        return;
      }

      await createDealTeamHighlight({
        data: {
          companyId: Number(selectedCompany),
          title: transcript.slice(0, 40) || "Audio note",
          description: transcript,
          authorId: 1, // TODO: replace with actual user id when available
          labels: [],
        },
      } as any);

      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const isCompanySelected = Boolean(
    selectedCompany && companies.find((c) => String(c.id) === selectedCompany)
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
            {companies.find((c) => String(c.id) === selectedCompany)?.name}
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
              style={
                recording ? { transform: `scale(${1 + level})` } : undefined
              }
            >
              {recording ? "Stop" : "Rec"}
            </button>
          </div>

          {audioUrl && (
            <audio className="mt-6 w-full max-w-md" controls src={audioUrl} />
          )}

          {audioUrl && !saved && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {isSaving ? "Saving…" : "Save"}
            </button>
          )}

          {saved && <p className="mt-4 text-green-600 font-medium">Saved!</p>}
        </>
      )}

      {/* Nested routes (e.g., /mobile/:id) render here */}
      <Outlet />
    </div>
  );
}
