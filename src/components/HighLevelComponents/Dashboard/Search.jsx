"use client";
import React, { useState, useCallback } from "react";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { MyImage } from "@/components/Image/Image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SearchModal = ({ searchOpen, setSearchOpen, uid }) => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ profiles: [], exhibitions: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce handler
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // Debounced search fetch
  const searchQuery = async (q) => {
    if (!q.trim()) {
      setResults({ profiles: [], exhibitions: [] });
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(false);

    try {
      const res = await fetch(`/api/data/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      console.error("Search failed:", err);
      setResults({ profiles: [], exhibitions: [] });
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(searchQuery, 500), []);

  // Trigger search
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      debouncedSearch(val);
    } else {
      setResults({ profiles: [], exhibitions: [] });
      setHasSearched(false);
      setIsLoading(false);
    }
  };

  // Skeleton Components
  const UserSkeleton = () => (
    <div className="flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 bg-gray-200/30 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200/20 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200/10 rounded w-1/2"></div>
      </div>
    </div>
  );

  const ExhibitionSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-5 bg-gray-100/20 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-200/10 rounded w-1/3"></div>
    </div>
  );

  const SkeletonSection = ({ title, count, Component }) => (
    <div>
      <h2 className="text-xl opacity-40 font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {Array.from({ length: count }, (_, i) => (
          <Component key={i} />
        ))}
      </div>
    </div>
  );

  // Check if we have any results
  const hasResults =
    results.profiles.length > 0 || results.exhibitions.length > 0;
  const showNoResults =
    hasSearched && !hasResults && !isLoading && query.trim();

  return (
    <div
      className={`fixed top-0 w-screen h-screen bg-black/30 backdrop-blur-xl flex flex-col px-7 lg:px-[10vw] text-white transition-all duration-300 ${
        searchOpen ? "z-50 opacity-100" : "z-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center">
        <button
          onClick={() => setSearchOpen(false)}
          className="flex flex-row justify-center items-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
        >
          <KeyboardBackspaceRoundedIcon fontSize="large" /> Go Back
        </button>
      </div>

      <input
        type="text"
        className="pb-2 outline-0 border-b-1 border-white text-3xl bg-transparent placeholder-white/40"
        placeholder="Search What You Like"
        value={query}
        onChange={handleInputChange}
      />

      {/* Results */}
      <div className="mt-6 overflow-y-auto max-h-[70vh] space-y-8">
        {/* Loading Skeletons */}
        {isLoading && (
          <>
            <SkeletonSection title="Users" count={3} Component={UserSkeleton} />
            <SkeletonSection
              title="Exhibitions"
              count={4}
              Component={ExhibitionSkeleton}
            />
          </>
        )}

        {/* Actual Results */}
        {!isLoading && hasResults && (
          <>
            {/* Profiles */}
            {results.profiles.length > 0 && (
              <div>
                <h2 className="text-xl opacity-40 font-bold mb-4">Users</h2>
                <ul className="space-y-6">
                  {results.profiles.map((user) => (
                    <li key={user.user_id}>
                      <a
                        href={`/user/${user.user_id}/answer`}
                        className="flex flex-row gap-4 cursor-pointer items-center hover:bg-white/5 rounded-lg p-2 transition-all duration-200 active:scale-95 active:bg-gradient-to-r active:from-white/10 active:to-white/5 transform active:shadow-lg"
                      >
                        <div className="overflow-hidden rounded-full">
                          <MyImage
                            src={user.profile_img}
                            alt={user.full_name}
                            h={40}
                            w={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <div>{user.full_name}</div>
                          <div className="text-sm opacity-50">{user.branch}</div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.exhibitions.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 opacity-40">
                  Exhibitions
                </h2>
                <ul className="space-y-4">
                  {results.exhibitions.map((ex) => (
                    <li
                      key={ex.id}
                      className="cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-all duration-200 active:scale-95 active:bg-gradient-to-r active:from-white/10 active:to-white/5 transform active:shadow-lg"
                    >
                      <a href={`/dashboard/user/${uid}/events/${ex.id}`}>
                      <div className="font-semibold">{ex.title}</div>
                      <div className="text-sm opacity-50">{ex.type}</div> </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* No results */}
        {showNoResults && (
          <div className="text-center mt-10 flex flex-col items-center space-y-4">
            <div className="text-6xl ">🔍</div>
            <div className="text-xl">Oops! Found Nothing</div>
            <div className="text-sm opacity-60">
              Try searching with different keywords
            </div>
          </div>
        )}

        {/* Empty state when no query */}
        {!query.trim() && !isLoading && (
          <div className="text-center  mt-20 flex flex-col items-center space-y-4">
            <div className="text-6xl ">✨</div>
            <div className="text-lg">Start typing to search</div>
            <div className="text-sm opacity-60">Find users and exhibitions</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
