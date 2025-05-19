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
}

const PicksContext = createContext<PicksContextType | undefined>(undefined);

export const PicksProvider = ({ children }: { children: React.ReactNode }) => {
  const [picks, setPicks] = useState<PickedMatch[]>([]);

  const FetchPicks = async () => {
    const { data, error } = await SupaBase.from("BetsList").select("*");
    if (error) {
      console.log("Error fetching from dataBase: ", error);
    } else {
      console.log("Fetching picks from database: ", data);
      setPicks(data);
    }
  };

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

  return (
    <PicksContext.Provider value={{ picks, addPick }}>
      {children}
    </PicksContext.Provider>
  );
};

export const usePicks = () => {
  const context = useContext(PicksContext);
  if (!context) throw new Error("usePicks must be used inside PicksProvider");
  return context;
};
