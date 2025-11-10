"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    fetchLeaderboardData();

    // Try to set up realtime subscriptions
    const leaderboardSubscription = supabase
      .channel("public:leaderboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leaderboard",
        },
        (payload) => {
          console.log("Leaderboard change detected:", payload);
          fetchLeaderboardData();
        }
      )
      .subscribe((status) => {
        console.log("Leaderboard subscription status:", status);
      });

    const teamsSubscription = supabase
      .channel("public:teams")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
        },
        (payload) => {
          console.log("Teams change detected:", payload);
          fetchLeaderboardData();
        }
      )
      .subscribe((status) => {
        console.log("Teams subscription status:", status);
      });

    const participantsSubscription = supabase
      .channel("public:participants")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
        },
        (payload) => {
          console.log("Participants change detected:", payload);
          fetchLeaderboardData();
        }
      )
      .subscribe((status) => {
        console.log("Participants subscription status:", status);
      });

    // Fallback: Poll every 5 seconds
    const pollInterval = setInterval(() => {
      fetchLeaderboardData();
    }, 5000);

    // Cleanup
    return () => {
      leaderboardSubscription.unsubscribe();
      teamsSubscription.unsubscribe();
      participantsSubscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Only show loading spinner on initial load
      if (isInitialLoad.current) {
        setIsLoading(true);
      }

      if (!supabaseUrl || !supabaseKey) {
        throw new Error(
          "Supabase environment variables are missing. Check your .env.local file."
        );
      }

      const { data, error } = await supabase.from("teams").select(`
          id, 
          team_name, 
          team_size,
          participants (
            name
          ),
          leaderboard!team_id (
            matches_played,
            points
          )
        `);

      if (error) {
        throw new Error(
          error.message || `Supabase error: ${JSON.stringify(error)}`
        );
      }

      if (!data || data.length === 0) {
        setTeams([]);
        setError(null);
        // Mark initial load as complete even if no data
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
          setIsLoading(false);
        }
        return;
      }

      const transformedTeams = data.map((team) => {
        const leaderboardData = Array.isArray(team.leaderboard)
          ? team.leaderboard[0]
          : team.leaderboard;

        return {
          id: team.id,
          team_name: team.team_name,
          team_size: team.team_size,
          matchesPlayed: leaderboardData?.matches_played || 0,
          points: leaderboardData?.points || 0,
          participants: team.participants || [],
        };
      });

      setTeams(transformedTeams);
      setError(null);

      // Mark initial load as complete
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        setIsLoading(false);
      }
    } catch (err) {
      const errorMessage =
        err?.message || err?.toString() || "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching leaderboard:", err);
      
      // Mark initial load as complete even on error
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        setIsLoading(false);
      }
    }
  };

  const sortedTeams = teams
    ? [...teams].sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        if (a.matchesPlayed !== b.matchesPlayed) {
          return a.matchesPlayed - b.matchesPlayed;
        }
        return a.team_name.localeCompare(b.team_name);
      })
    : [];

  const getRankBadge = (rank) => {
    const baseClasses =
      "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full font-bold text-xs sm:text-sm";

    switch (rank) {
      case 1:
        return `${baseClasses} bg-yellow-500 text-black shadow-lg shadow-yellow-500/30`;
      case 2:
        return `${baseClasses} bg-gray-300 text-black shadow-lg shadow-gray-300/30`;
      case 3:
        return `${baseClasses} bg-orange-600 text-white shadow-lg shadow-orange-600/30`;
      default:
        return `${baseClasses} bg-gray-600 text-white`;
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank;
    }
  };

  const formatParticipantNames = (participants) => {
    if (!participants || participants.length === 0) {
      return "No participants";
    }

    if (participants.length <= 5) {
      return participants.map((p) => p.name).join(", ");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden p-4 sm:p-8">
        <div className="text-center text-gray-400">
          <div className="animate-pulse text-base sm:text-lg">
            Loading leaderboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden p-4 sm:p-8">
        <div className="text-center">
          <p className="text-red-400 text-base sm:text-lg mb-4">
            Error loading leaderboard
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mb-6">{error}</p>
          <button
            onClick={fetchLeaderboardData}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 sm:px-6 rounded transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 text-white p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-300 transition-colors flex items-center"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="ml-2 text-sm sm:text-base">Back</span>
          </button>
        </div>
        <h2 className="text-lg sm:text-2xl font-semibold text-center">
          RoBo-Arena
        </h2>
        <h1 className="text-2xl sm:text-4xl font-bold text-center">
          Wall of Fame
        </h1>
      </div>

      {/* Desktop Table Header - Hidden on mobile */}
      <div className="hidden sm:block bg-gray-800 border-b border-gray-700">
        <div className="flex items-center py-4 px-6 font-semibold text-gray-300">
          <div className="w-16 text-center">Rank</div>
          <div className="flex-1 ml-4">Team Name</div>
          <div className="w-32 text-center">Matches</div>
          <div className="w-32 text-center">Points</div>
        </div>
      </div>

      {/* Team Rows */}
      <div className="divide-y divide-gray-700">
        {sortedTeams.length === 0 ? (
          <div className="p-4 sm:p-8 text-center text-gray-400">
            <p className="text-base sm:text-lg">No teams available</p>
            <p className="text-xs sm:text-sm mt-2">
              Add teams to see the leaderboard
            </p>
          </div>
        ) : (
          sortedTeams.map((team, index) => {
            const rank = index + 1;

            return (
              <div
                key={team.id}
                className={`
                  py-4 px-4 sm:px-6 hover:bg-gray-800 transition-colors duration-200
                  ${
                    rank <= 3
                      ? "bg-gradient-to-r from-yellow-900/20 to-transparent"
                      : ""
                  }
                `}
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className={getRankBadge(rank)}>
                        {getRankIcon(rank)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-base truncate">
                        {team.team_name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {formatParticipantNames(team.participants)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-gray-800 rounded-lg p-3 mt-2">
                    <div className="text-center flex-1">
                      <div className="font-semibold text-white text-sm">
                        {team.matchesPlayed}
                      </div>
                      <div className="text-xs text-gray-400">matches</div>
                    </div>
                    <div className="w-px h-8 bg-gray-600 mx-2"></div>
                    <div className="text-center flex-1">
                      <div className="font-bold text-white text-lg">
                        {team.points}
                      </div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center">
                  <div className="w-16 flex justify-center">
                    <div className={getRankBadge(rank)}>
                      {getRankIcon(rank)}
                    </div>
                  </div>

                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold text-white text-lg">
                      {team.team_name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {formatParticipantNames(team.participants)}
                    </p>
                  </div>

                  <div className="w-32 text-center">
                    <div className="font-semibold text-white text-lg">
                      {team.matchesPlayed}
                    </div>
                    <div className="text-xs text-gray-400">matches</div>
                  </div>

                  <div className="w-32 text-center">
                    <div className="font-bold text-xl text-white">
                      {team.points}
                    </div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Stats */}
      {sortedTeams.length > 0 && (
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex justify-center">
            <span className="text-xs sm:text-sm text-gray-400">
              <strong className="text-white">{sortedTeams.length}</strong>{" "}
              Teams
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;


