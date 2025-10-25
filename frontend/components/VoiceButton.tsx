"use client";

import { useRef, useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axios";

type SpeechRecognition = typeof window extends { SpeechRecognition: infer T }
  ? T
  : any;

type SpeechRecognitionEvent = typeof window extends {
  SpeechRecognitionEvent: infer E;
}
  ? E
  : any;

interface Window {
  SpeechRecognition: SpeechRecognition;
  webkitSpeechRecognition: SpeechRecognition;
}

declare var webkitSpeechRecognition: {
  new (): SpeechRecognition;
};

export default function VoiceInput() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();

  const startRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      // Guard access to results to avoid TypeScript constructor/instance mismatch
      const text = event?.results?.[0]?.[0]?.transcript ?? "";
      if (text) {
        setTranscript(text);
        sendToBackend(text);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const sendToBackend = async (text: string) => {
    setLoading(true);
    try {
      const res = await axiosClient.post("/voice/interpret", {
        command: text,
      });

      const data = res.data;
      console.log("Backend response:", data);

      // Clear transcript right after sending
      setTranscript("");

      if (data.success && data.productData) {
        const formattedName = encodeURIComponent(
          data.productData.product_name.toLowerCase().replace(/\s+/g, "-")
        );
        router.push(`/search?q=${formattedName}`);
      }
    } catch (error) {
      console.error("Error sending transcript:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      startRecognition();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {/* Transcript Preview */}
      {transcript && (
        <div className="bg-white border px-3 py-2 rounded-md shadow text-sm max-w-sm">
          <strong>You said:</strong> {transcript}
        </div>
      )}

      {/* Mic Button */}
      <Button
        onClick={handleMicClick}
        variant="outline"
        className="rounded-full w-14 h-14 flex items-center justify-center shadow-md"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : listening ? (
          <MicOff className="text-red-600" />
        ) : (
          <Mic />
        )}
      </Button>
    </div>
  );
}
