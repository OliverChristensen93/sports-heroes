import React from "react";
import { usePicks } from "../contexts/PicksContext";
import MatchCard from "../components/MatchCard";
import "../App.css";

const Scores = () => {
  const { picks } = usePicks();

  return (
    <div className="wrapper">
      {/* Left Ad */}
      <aside className="ads">
        <div className="h-screen bg-gray-200">Your total score is: </div>
      </aside>
      <main className="col-span-12 lg:col-span-8">
        <h2>Your Picked Matches</h2>

        {picks.map((pick) => {
          const snapshot = pick.matchSnapshot;

          return (
            <MatchCard
              key={pick.matchId}
              id={pick.matchId}
              team1={snapshot.team1}
              team1Score={snapshot.team1Score}
              team2={snapshot.team2}
              team2Score={snapshot.team2Score}
              startTime={snapshot.startTime}
              pickedHomeTeam={pick.pickedHome}
              readOnly={true}
            />
          );
        })}
      </main>
      {/* Right Ad */}
      <aside className="ads">
        <div className="h-screen bg-gray-200">Ad Right</div>
      </aside>
    </div>
  );
};

export default Scores;
