"use client";

import { useEffect, useRef } from "react";
import { normalizeEan } from "@/lib/barcode";

interface BarcodeScannerProps {
  onDetect: (ean: string) => void;
  onError: (reason: "denied" | "unsupported") => void;
}

interface DetectorLike {
  detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]>;
}

export default function BarcodeScanner({ onDetect, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onDetectRef = useRef(onDetect);
  const onErrorRef = useRef(onError);
  onDetectRef.current = onDetect;
  onErrorRef.current = onError;

  useEffect(() => {
    let stopped = false;
    let stream: MediaStream | null = null;
    let raf = 0;
    let stopZxing: (() => void) | null = null;
    let done = false;

    const found = (raw: string) => {
      const ean = normalizeEan(raw);
      if (!ean || done || stopped) return;
      done = true;
      onDetectRef.current(ean);
    };

    async function start() {
      const video = videoRef.current;
      if (!video || !navigator.mediaDevices?.getUserMedia) {
        onErrorRef.current("unsupported");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch {
        onErrorRef.current("denied");
        return;
      }
      if (stopped) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      video.srcObject = stream;
      await video.play().catch(() => undefined);

      const BD = (window as unknown as {
        BarcodeDetector?: new (o: { formats: string[] }) => DetectorLike;
      }).BarcodeDetector;

      if (BD) {
        const detector = new BD({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });
        const tick = async () => {
          if (stopped || done) return;
          try {
            const codes = await detector.detect(video);
            if (codes[0]) found(codes[0].rawValue);
          } catch {
            /* frame non pronto: riprova */
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return;
      }

      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromStream(stream, video, (result) => {
          if (result) found(result.getText());
        });
        stopZxing = () => controls.stop();
      } catch {
        onErrorRef.current("unsupported");
      }
    }

    start();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stopZxing?.();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black">
      <video
        ref={videoRef}
        playsInline
        muted
        className="aspect-[3/4] w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-8 top-1/2 h-24 -translate-y-1/2 rounded-xl border-2 border-gold/80" />
      <p className="absolute inset-x-0 bottom-3 text-center text-[12px] text-white/90">
        Inquadra il codice a barre del prodotto
      </p>
    </div>
  );
}
