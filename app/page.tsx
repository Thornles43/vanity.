"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import AppShell, { type Tab } from "@/components/AppShell";
import AuthGate from "@/components/AuthGate";
import Profile from "@/components/Profile";
import ScanFlow from "@/components/ScanFlow";
import Toast from "@/components/Toast";
import Vault from "@/components/Vault";
import { listVault, removeFromVault } from "@/lib/vault";
import type { Product } from "@/lib/types";

function VanityApp({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>("vault");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setProducts(await listVault());
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Errore di caricamento.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [reload]);

  const handleAdded = async (name: string, id: string) => {
    setScanning(false);
    setTab("vault");
    await reload();
    setNewId(id);
    showToast(`${name} aggiunto allo Scrigno ✨`);
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromVault(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Prodotto rimosso");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Errore");
    }
  };

  return (
    <>
      <AppShell tab={tab} onTab={setTab} onScan={() => setScanning(true)}>
        {tab === "vault" && (
          <Vault
            products={products}
            loading={loading}
            loadError={loadError}
            newId={newId}
            onScan={() => setScanning(true)}
            onRemove={handleRemove}
            onRetry={reload}
          />
        )}
        {tab === "profile" && (
          <Profile email={user.email ?? ""} count={products.length} />
        )}
      </AppShell>
      <Toast message={toast} />
      {scanning && (
        <ScanFlow onClose={() => setScanning(false)} onAdded={handleAdded} />
      )}
    </>
  );
}

export default function Home() {
  return <AuthGate>{(user) => <VanityApp user={user} />}</AuthGate>;
}
