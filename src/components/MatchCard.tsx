import React from "react";
import { usePicks } from "../contexts/PicksContext";
import SupaBase from "../supabase-client";

interface Props {
  id?: number;
  team1: string;
  team1Score?: number;
  team1onClick?: () => void;
  team2: string;
  team2Score?: number;
  team2onClick?: () => void;
  startTime?: string;
  pickedHomeTeam?: boolean;
  readOnly?: boolean;
}

const MatchCard = ({
  id,
  team1,
  team1Score = 0,
  team2,
  team2Score = 0,
  startTime = "Unknown",
  pickedHomeTeam,
  readOnly,
}: Props) => {
  const { picks, addPick } = usePicks();
  const existingPick = picks.find((pick) => pick.matchId === id);

  const team1Won = team1Score > team2Score;
  const team2Won = team2Score > team1Score;

  const team1Class = [
    pickedHomeTeam == true && "picked-team",
    team1Won && "winning-team",
    "btn btn-outline-primary",
  ]
    .filter(Boolean)
    .join(" ");

  const team2Class = [
    "btn btn-outline-primary",
    pickedHomeTeam == false && "picked-team",
    team2Won && "winning-team",
  ]
    .filter(Boolean)
    .join(" ");

  const addPickDB = async (homeTeamPicked: boolean) => {
    const {
      data: { user },
    } = await SupaBase.auth.getUser();

    if (!user) {
      //Maybe route the user to the login page here?
      throw new Error("User not authenticated. Login before making picks");
    }

    const NewPickData = {
      matchID: id,
      pickedHome: homeTeamPicked,
      user_id: user.id,
    };

    const { data, error } = await SupaBase.from("BetsList")
      .insert([NewPickData])
      .single();

    if (error) {
      console.log("Error adding pick to Database: ", error);
    } else {
      console.log("Created new pick in database. With following data" + data);
    }
  };

  const handlePickTeam1 = () => {
    if (!existingPick && id !== undefined) {
      addPick({
        matchId: id,
        pickedHome: true,
        matchSnapshot: {
          team1,
          team1Score,
          team2,
          team2Score,
          startTime,
        },
        timestamp: new Date().toISOString(),
      });
      addPickDB(true);
    }
  };

  const handlePickTeam2 = () => {
    if (!existingPick && id !== undefined) {
      addPick({
        matchId: id,
        pickedHome: false,
        matchSnapshot: {
          team1,
          team1Score,
          team2,
          team2Score,
          startTime,
        },
        timestamp: new Date().toISOString(),
      });
      addPickDB(false);
    }
  };

  return (
    <div className="container">
      <header>{startTime}</header>
      <div
        className="container"
        style={{ display: "flex", alignItems: "center" }}
      >
        <button
          onClick={handlePickTeam1}
          disabled={!!existingPick || readOnly}
          className={team1Class}
        >
          <img src={`/icons/${team1}.png`} alt={team1} className="team-icon" />
          {team1} ({team1Score})
        </button>

        <span>vs</span>

        <button
          onClick={handlePickTeam2}
          disabled={!!existingPick}
          className={team2Class}
        >
          <img src={`/icons/${team2}.png`} alt={team2} className="team-icon" />
          {team2} ({team2Score})
        </button>
      </div>
      {existingPick && (
        <p style={{ marginTop: "8px", color: "green" }}>
          You picked: {existingPick.pickedHome ? team1 : team2}
        </p>
      )}
    </div>
  );
};

export default MatchCard;
