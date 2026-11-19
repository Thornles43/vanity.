"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import LoginScreen from "./LoginScreen";
import { supabase } from "@/lib/supabase";

interface AuthGateProps {
  children: (user: User) => React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-[100dvh] bg-surface" />;
  if (!user) return <LoginScreen />;
  return <>{children(user)}</>;
}
