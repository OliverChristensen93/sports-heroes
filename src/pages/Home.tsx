import React from "react";
import MatchCard from "../components/MatchCard";
import { BalldontlieAPI } from "@balldontlie/sdk";
import { useState, useEffect } from "react";
import { usePicks } from "../contexts/PicksContext";
import "../App.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SupaBase from "../supabase-client";

const api = new BalldontlieAPI({
  apiKey: "e7cb3934-1d84-4929-82ce-1d77033c10f9",
});
///Collect Teams
// Using async/await
const amountOfDatesToFetch = 2;

const Home = () => {
  const today = new Date().toISOString().split("T")[0]; // "2025-05-06"
  const [dateIndex, setDateIndex] = useState(today);
  const [loading, setLoading] = useState(true);
  const { picks } = usePicks();
  const [fetchError, setFetchError] = useState<string | null>(null);

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
    pickedHome?: boolean;
    readOnly?: boolean;
  }

  interface DBMatch {
    matchID: number;
    team1: string;
    team2: string;
    team1Score: number;
    team2Score: number;
    startTime: string;
  }

  const changeDate = (change: number) => {
    const current = new Date(dateIndex);
    current.setDate(current.getDate() + change); // adds change
    const next = current.toISOString().split("T")[0];
    setDateIndex(next);
  };

  const getDates = (dateInterval: number) => {
    const current = new Date(dateIndex);
    current.setDate(current.getDate() + dateInterval - 1); // adds change //Do -1 so getDates and getNextNDates correlate.
    const adjustedDate = current.toISOString().split("T")[0];
    return adjustedDate;
  };

  const getNextNDates = (n: number) => {
    return Array.from({ length: n }, (_, i) => {
      const date = new Date(dateIndex);
      date.setDate(date.getDate() + i);
      return date.toISOString().split("T")[0];
    });
  };

  ///Get matches.
  // First try to get them from the dataBase.
  // If they dont exist in dataBase search in API then store in DB.
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        // Step 1: Try fetching from Supabase

        const datesToFetch = getNextNDates(amountOfDatesToFetch);
        const { data: existingMatches, error: dbError } = await SupaBase.from(
          "MatchesList"
        )
          .select("*")
          .in("startTime", datesToFetch); // Make sure startTime in DB is stored as YYYY-MM-DD only

        if (dbError) throw dbError;

        //Check if all datesFetched has matches(games)
        let allDatesHaveMatches = true;
        for (const date of datesToFetch) {
          const hasMatch = existingMatches?.some(
            (match) => match.startTime === date
          );

          if (!hasMatch) {
            allDatesHaveMatches = false;
            console.log("DATABASE ----- DATE NOT FOUND IN DATABASE : " + date);
            break;
          }
          console.log("DATABASE - Date was found in the dataBase. " + date);
        }

        if (allDatesHaveMatches) {
          // Matches found in DB — use them
          console.log("Found matches in dataBase on date: " + dateIndex);
          const formattedMatches = existingMatches.map((match: DBMatch) => ({
            id: match.matchID,
            team1: match.team1,
            team1Score: match.team1Score,
            team2: match.team2,
            team2Score: match.team2Score,
            startTime: match.startTime,
          }));

          setMatches(formattedMatches);
        } else {
          // Step 2: Fetch from API (if not in DB)
          console.log(
            "No matches found in database on day: " +
              dateIndex +
              " attempting to fetch from API."
          );
          const apiResponse = await api.nba.getGames({
            start_date: dateIndex,
            end_date: getDates(amountOfDatesToFetch),
          });

          const games = apiResponse.data;

          if (games.length > 0) {
            const formattedMatches = games.map((game) => ({
              id: game.id,
              team1: game.home_team.abbreviation,
              team1Score: game.home_team_score,
              team2: game.visitor_team.abbreviation,
              team2Score: game.visitor_team_score,
              startTime: game.date, // Normalize date
              //console.log("start time was ", game.date,)
            }));

            // Step 3: Store them in Supabase
            const matchesToInsert = formattedMatches.map((m) => ({
              matchID: m.id,
              team1: m.team1,
              team2: m.team2,
              team1Score: m.team1Score,
              team2Score: m.team2Score,
              startTime: m.startTime,
            }));

            const { error: insertError } = await SupaBase.from(
              "MatchesList"
            ).upsert(matchesToInsert, { onConflict: "matchID" });

            if (insertError) {
              console.error("Error inserting matches into DB:", insertError);
            }

            setMatches(formattedMatches);

            console.log("Stored fetched matches in DataBase. :)");
          } else console.log("NO matches on that day!!! ");
        }
      } catch (error) {
        console.error("Error in fetchMatches:", error);
        setFetchError("An error occurred while loading matches.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [dateIndex]);

  return (
    <>
      <h1>Sports Heroes</h1>
      <div className="wrapper">
        {/* Left Ad */}
        <aside className="ads">
          <div className="h-screen bg-gray-200">Ad Left</div>
        </aside>
        <main className="col-span-12 lg:col-span-8">
          <div className="p-4">
            {" "}
            {dateIndex != today && (
              <button
                type="button"
                className="btn btn-info"
                onClick={() => setDateIndex(today)}
              >
                Go to today
              </button>
            )}
          </div>
          <div
            className="container"
            style={{ display: "flex", alignItems: "center" }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => changeDate(-1)}
            >
              Previous day
            </button>
            <DatePicker
              selected={new Date(dateIndex)}
              onChange={(date) => {
                if (date) {
                  setDateIndex(date.toISOString().slice(0, 10));
                }
              }}
              customInput={
                <button className="btn btn-outline-secondary">
                  📅 Date is {dateIndex}
                </button>
              }
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => changeDate(1)}
            >
              Next day
            </button>
          </div>
          {fetchError && (
            <div className="alert alert-danger" role="alert">
              {fetchError}
            </div>
          )}
          <div className="matchContainer">
            {loading && <div>Loading...</div>}
            {matches.length === 0 && !loading ? (
              <p>No matches found for this date.</p>
            ) : (
              matches.map((match) => {
                const existingPick = picks.find((p) => p.matchId === match.id);

                return (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    team1={match.team1}
                    team1Score={match.team1Score}
                    team2={match.team2}
                    team2Score={match.team2Score}
                    startTime={match.startTime}
                    pickedHomeTeam={existingPick?.pickedHome} // ✅ Pass it here
                  />
                );
              })
            )}
          </div>
        </main>
        {/* Right Ad */}
        <aside className="ads">
          <div className="h-screen bg-gray-200">Ad Right</div>
        </aside>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

export default Home;
