"use client";

import { useRef, useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import axiosClient from "@/lib/axios";
import { Card, CardContent } from "./ui/card";
import { useCart } from "@/context/CartContext";

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
  const pathname = usePathname();
  const {refreshCart} = useCart();

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

      if (data.success) {
        if(data.products && data.products.length > 0){
          router.push(`/search?q=${data.products[0].product_name.toLowerCase()}`);
        }
        else if(data.userCart){
          refreshCart();
        }
        else if(data.signin){
          if(pathname === '/signin'){
            router.push('/signin?success=true')
          }
          else {
            router.push('/signin')
          }
        }
        else if(data.signup){
          if(pathname === '/signup'){
            router.push('/signup?success=true')
          }
          else {
            router.push('/signup')
          }
        }
        else if(data.info){
          const info = data.info;
          if(pathname === '/signin'){
            router.push(`/signin?email=${info.email}&password=${info.password}`)
          }
          else if(pathname === '/signup'){
            router.push(`/signup?name=${info.name}&email=${info.email}&phone=${info.phone}&password=${info.password}`)
          }
        }
        else if(data.result){
          router.push('/cart');
        }
        else if(data.order){
          router.push('/orders')
        }
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
        <Card className="bg-white shadow-lg border border-gray-200 max-w-sm">
          <CardContent className="p-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">You said:</span> {transcript}
            </p>
          </CardContent>
        </Card>
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
