import React, { createContext, useContext, useEffect, useState } from "react";
import SupaBase from "../supabase-client";

interface PickedMatch {
  matchId: number;
  pickedHome: boolean;
  matchSnapshot?: any; // Replace with proper Match type if available
  timestamp?: string;
}

interface PicksContextType {
  picks: PickedMatch[];
  addPick: (pick: PickedMatch) => void;
  resetPicks: () => void;
}

const PicksContext = createContext<PicksContextType | undefined>(undefined);

export const PicksProvider = ({ children }: { children: React.ReactNode }) => {
  const [picks, setPicks] = useState<PickedMatch[]>([]);

  useEffect(() => {
    const fetchPicks = async () => {
      const {
        data: { user },
      } = await SupaBase.auth.getUser();

      if (!user) return;

      const { data, error } = await SupaBase.from("betsList")
        .select("*")
        .eq("user_id", user.id);

      if (error) console.error(error);
      else setPicks(data);
    };

    fetchPicks();
  }, []);

  useEffect(() => {
    //FetchPicks();
    //How to fetch it from localStorage.
    const stored = localStorage.getItem("picks");

    //console.log("Loaded picks from storage:", stored);
    if (stored) {
      setPicks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    //console.log("Saving picks to localStorage:", picks);
    localStorage.setItem("picks", JSON.stringify(picks));
  }, [picks]);

  const addPick = (newPick: PickedMatch) => {
    // Avoid duplicates
    setPicks((prev) => [
      ...prev.filter((p) => p.matchId !== newPick.matchId),
      newPick,
    ]);
  };

  const resetPicks = () => {
    setPicks([]);
    console.log("Picks have been reset. (Probably after a logout)");
  };

  return (
    <PicksContext.Provider value={{ picks, addPick, resetPicks }}>
      {children}
    </PicksContext.Provider>
  );
};

export const usePicks = () => {
  const context = useContext(PicksContext);
  if (!context) throw new Error("usePicks must be used inside PicksProvider");
  return context;
};
