"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Leaderboard from "../../components/RoboLeaderboard";

// Initialize Supabase client with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const LeaderboardPage = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();

    // Subscribe to real-time updates for both teams and participants tables
    const teamsSubscription = supabase
      .channel("leaderboard-teams-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
        },
        (payload) => {
          console.log("Teams table update detected:", payload);
          fetchTeams();
        }
      )
      .subscribe();

    const participantsSubscription = supabase
      .channel("leaderboard-participants-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
        },
        (payload) => {
          console.log("Participants table update detected:", payload);
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      teamsSubscription.unsubscribe();
      participantsSubscription.unsubscribe();
    };
  }, []);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);

      if (!supabaseUrl || !supabaseKey) {
        throw new Error(
          "Supabase environment variables are missing. Please check your .env.local file and restart the dev server."
        );
      }

      console.log("Fetching teams with participants from Supabase...");

      // Query only existing columns from the teams table
      const { data, error } = await supabase
        .from("teams")
        .select(`
          id, 
          team_name, 
          team_size,
          participants (
            name
          )
        `);

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(
          error.message || `Database error: ${JSON.stringify(error)}`
        );
      }

      if (!data) {
        throw new Error("No data returned from database");
      }

      // Transform data - set matches_played and points to 0 since they don't exist
      const transformedTeams = data.map((team) => ({
        id: team.id,
        team_name: team.team_name,
        team_size: team.team_size || 0,
        matchesPlayed: 0, // Default since column doesn't exist
        points: 0, // Default since column doesn't exist
        participants: team.participants || [],
      }));

      console.log("Transformed teams with participants:", transformedTeams);

      setTeams(transformedTeams);
      setError(null);
    } catch (err) {
      const errorMessage =
        err?.message || err?.toString() || "Unknown error occurred";
      console.error("Error fetching teams:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading leaderboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline mt-2">{error}</span>
            <div className="mt-4">
              <button
                onClick={fetchTeams}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Retry
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Reload Page
              </button>
            </div>
          </div>
        ) : (
          <Leaderboard teams={teams} />
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
