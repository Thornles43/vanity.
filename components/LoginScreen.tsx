"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Email o password errate.";
  if (m.includes("already registered")) return "Esiste già un account con questa email.";
  if (m.includes("password") && m.includes("6")) return "La password deve avere almeno 6 caratteri.";
  if (m.includes("rate limit")) return "Troppi tentativi. Riprova tra qualche minuto.";
  if (m.includes("email not confirmed")) return "Conferma prima la tua email dal messaggio che ti abbiamo inviato.";
  return "Qualcosa è andato storto. Riprova.";
}

export default function LoginScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) setError(translateError(err.message));
      } else {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) setError(translateError(err.message));
        else if (!data.session) {
          setInfo("Account creato. Controlla la tua email e conferma l'indirizzo, poi accedi.");
          setMode("login");
        }
      }
    } catch {
      setError("Connessione assente. Riprova.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-center gap-6 bg-surface px-margin py-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="gilded-border flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low">
          <span className="font-serif text-[22px] font-bold italic text-primary">VD</span>
        </span>
        <h1 className="font-serif text-[28px] font-medium italic text-on-surface">VanityDiary</h1>
        <p className="max-w-[18rem] text-[13px] font-light text-on-surface-variant">
          Scansiona i tuoi prodotti e non dimenticare più quando scadono.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-outline-variant bg-white px-4 py-3 text-[15px] outline-none focus:border-primary"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="Password (almeno 6 caratteri)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-outline-variant bg-white px-4 py-3 text-[15px] outline-none focus:border-primary"
        />
        {error && <p role="alert" className="text-[13px] text-error">{error}</p>}
        {info && <p className="text-[13px] text-primary">{info}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rose-gold-gradient rounded-xl px-6 py-3 font-serif text-[16px] italic text-white shadow-md disabled:opacity-60"
        >
          {busy ? "Attendi…" : mode === "login" ? "Accedi" : "Crea account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError(null);
          setInfo(null);
        }}
        className="text-[13px] text-primary underline-offset-4 hover:underline"
      >
        {mode === "login" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
      </button>
    </div>
  );
}
