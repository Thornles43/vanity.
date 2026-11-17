"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AppShell, { type Tab } from "@/components/AppShell";
import Feed from "@/components/Feed";
import Onboarding from "@/components/Onboarding";
import Profile from "@/components/Profile";
import ScanOverlay from "@/components/ScanOverlay";
import Toast from "@/components/Toast";
import Vault from "@/components/Vault";
import { INITIAL_PRODUCTS, SCAN_QUEUE } from "@/lib/data";
import type { Product } from "@/lib/types";

const STORAGE_KEY = "vanitydiary:vault-unlocked";
const DUPE_ID = "dupe-cica-ceramide";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState<Tab>("vault");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [newId, setNewId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const scanIndex = useRef(0);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      setUnlocked(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setUnlocked(false);
    }
    setReady(true);
    return () => {
      if (scanTimer.current) clearTimeout(scanTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const handleUnlock = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* localStorage non disponibile: si prosegue comunque */
    }
    setTab("vault");
    setUnlocked(true);
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
    setProducts(INITIAL_PRODUCTS);
    setNewId(null);
    setTab("vault");
    setUnlocked(false);
  };

  const handleScan = () => {
    if (scanning) return;
    setScanning(true);
    scanTimer.current = setTimeout(() => {
      const template = SCAN_QUEUE[scanIndex.current % SCAN_QUEUE.length];
      scanIndex.current += 1;
      const id = `scan-${Date.now()}`;
      setProducts((prev) => [{ ...template, id, openedDaysAgo: 0 }, ...prev]);
      setNewId(id);
      setScanning(false);
      setTab("vault");
      showToast(`${template.name} aggiunto al Vault ✨`);
    }, 1800);
  };

  const handleAddDupe = () => {
    if (products.some((p) => p.id === DUPE_ID)) {
      showToast("Questo dupe è già nel tuo Vault");
      return;
    }
    setProducts((prev) => [
      {
        id: DUPE_ID,
        brand: "Cica Lab",
        name: "Cica-Ceramide Gel",
        category: "Skincare",
        routines: ["morning", "night"],
        emoji: "🌿",
        size: "50 ml",
        price: 19.5,
        paoMonths: 12,
        openedDaysAgo: 0,
      },
      ...prev,
    ]);
    setNewId(DUPE_ID);
    showToast("Cica-Ceramide Gel aggiunto al Vault 🌿");
  };

  if (!ready) {
    return <div className="min-h-[100dvh] bg-surface" />;
  }

  if (!unlocked) {
    return <Onboarding onUnlock={handleUnlock} />;
  }

  return (
    <>
      <AppShell tab={tab} onTab={setTab} onScan={handleScan}>
        {tab === "vault" && (
          <Vault products={products} newId={newId} onScan={handleScan} />
        )}
        {tab === "feed" && (
          <Feed
            dupeAdded={products.some((p) => p.id === DUPE_ID)}
            onAddDupe={handleAddDupe}
            onGoVault={() => setTab("vault")}
            onToast={showToast}
          />
        )}
        {tab === "profile" && (
          <Profile products={products} onToast={showToast} onLogout={handleLogout} />
        )}
      </AppShell>
      <Toast message={toast} />
      {scanning && <ScanOverlay />}
    </>
  );
}
