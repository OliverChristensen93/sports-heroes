import React, { createContext, useContext, useEffect, useState } from "react";
import SupaBase from "../supabase-client";

interface Match {
  id: number;
  team1: string;
  team2: string;
  startTime: string;
  team1Score?: number;
  team2Score?: number;
}

interface PickedMatch {
  matchId: number;
  pickedHome: boolean;
  matchSnapshot?: Match; // Replace with proper Match type if available
}

interface PicksContextType {
  picks: PickedMatch[];
  addPick: (pick: PickedMatch) => void;
  resetPicks: () => void;
  fetchPicks: () => void;
}

const PicksContext = createContext<PicksContextType | undefined>(undefined);

export const PicksProvider = ({ children }: { children: React.ReactNode }) => {
  const [picks, setPicks] = useState<PickedMatch[]>([]);

  const fetchPicks = async () => {
    const {
      data: { user },
    } = await SupaBase.auth.getUser();
    if (!user) return;

    const { data: picksData, error } = await SupaBase.from("BetsList")
      .select("matchID, pickedHome") // Add user_id if needed
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching picks:", error);
      return;
    }

    // Fetch related matches
    const matchIds = picksData.map((p) => p.matchID);
    const { data: matches } = await SupaBase.from("MatchesList")
      .select("*")
      .in("matchID", matchIds);

    const picks = picksData.map((pick) => ({
      matchId: pick.matchID,
      pickedHome: pick.pickedHome,
      matchSnapshot: matches?.find((m) => m.matchID === pick.matchID),
    }));
    console.log("INTRO - Setting picks to:");
    console.log(picks);
    setPicks(picks);
  };

  //Run fetchPicks on load.
  useEffect(() => {
    fetchPicks();
  }, []);

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
    <PicksContext.Provider value={{ picks, addPick, resetPicks, fetchPicks }}>
      {children}
    </PicksContext.Provider>
  );
};

export const usePicks = () => {
  const context = useContext(PicksContext);
  if (!context) throw new Error("usePicks must be used inside PicksProvider");
  return context;
};
