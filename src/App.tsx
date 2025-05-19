import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import { BalldontlieAPI } from "@balldontlie/sdk";
import Home from "./pages/Home";
import Scores from "./pages/Scores";
import SupaBase from "./supabase-client";

const api = new BalldontlieAPI({
  apiKey: "e7cb3934-1d84-4929-82ce-1d77033c10f9",
});
///Collect Teams
// Using async/await

function App() {
  const today = new Date().toISOString().split("T")[0]; // "2025-05-06"
  const [dateIndex, setDateIndex] = useState(today);

  const [matches, setMatches] = useState<Match[]>([]);

  interface Match {
    id: number;
    team1: string;
    team1Score?: number;
    team1onClick?: () => void;
    team2: string;
    team2Score?: number;
    team2onClick?: () => void;
    startTime?: string;
    pickedTeam?: number;
  }

  const getDates = (dateInterval: number) => {
    const current = new Date(dateIndex);
    current.setDate(current.getDate() + dateInterval); // adds change
    const adjustedDate = current.toISOString().split("T")[0];
    return adjustedDate;
  };

  useEffect(() => {
    async function getTeams() {
      try {
        const response = await api.nba.getGames({
          start_date: getDates(-1),
          end_date: getDates(+1),
        });
        //console.log(teams.data);

        console.log("Get dates are: " + getDates(-1) + "-" + getDates(+1));
        const games = response.data;

        const formattedMatches = games.map((game) => ({
          id: game.id,
          team1: game.home_team.abbreviation,
          team1Score: game.home_team_score,
          team2: game.visitor_team.abbreviation,
          team2Score: game.visitor_team_score,
          startTime: game.date,
        }));

        setMatches(formattedMatches);
      } catch (error) {
        console.error(error);
      }
    }

    getTeams();
  }, [dateIndex]);

  return (
    <>
      <NavBar></NavBar>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Scores" element={<Scores />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
