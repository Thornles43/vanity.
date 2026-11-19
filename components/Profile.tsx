"use client";

import { LogOut, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProfileProps {
  email: string;
  count: number;
}

export default function Profile({ email, count }: ProfileProps) {
  return (
    <div className="flex flex-col items-center gap-5 px-margin pt-10 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-container to-primary text-white">
        <UserRound className="h-9 w-9" strokeWidth={1.5} />
      </span>
      <div>
        <p className="font-serif text-[20px] italic text-on-surface">{email}</p>
        <p className="mt-1 text-[13px] text-on-surface-variant">
          {count === 0
            ? "Il tuo Scrigno è vuoto"
            : `${count} ${count === 1 ? "elisir" : "elisir"} nel tuo Scrigno`}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void supabase.auth.signOut()}
        className="flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-5 py-2.5 text-[14px] text-on-surface"
      >
        <LogOut className="h-4 w-4" />
        Esci
      </button>
    </div>
  );
}
