"use client";
import React, {  useState, useCallback } from "react";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { MyImage } from "@/components/Image/Image";
import { useRouter } from "next/navigation";

const SearchModal = ({ searchOpen, setSearchOpen, uid }) => {
    const router = useRouter()
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ profiles: [], exhibitions: [] });

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
      return;
    }

    try {
      const res = await fetch(`/api/data/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const debouncedSearch = useCallback(debounce(searchQuery, 500), []);

  // Trigger search
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  };

  return (
    <div
      className={`fixed top-0 w-screen h-screen bg-black/30 backdrop-blur-xl flex flex-col px-7 lg:px-[10vw] text-white transition-all duration-300 ${
        searchOpen ? "z-50 opacity-100" : "z-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center">
        <button
          onClick={() => setSearchOpen(false)}
          className="flex flex-row justify-center items-center gap-2 opacity-40 hover:opacity-100"
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
        {/* Profiles */}
        {results.profiles.length > 0 && (
          <div>
            <h2 className="text-xl opacity-40 font-bold mb-4">Users</h2>
            <ul className="space-y-6">
              {results.profiles.map((user) => (
            
                <li 
                onClick={() => router.push(`/user/${user.user_id}/answer`)}
                key={user.user_id} className="flex items-center gap-4">
                  <div className=" overflow-hidden rounded-full">
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
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exhibitions */}
        {results.exhibitions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 opacity-40">Exhibitions</h2>
            <ul className="space-y-4">
              {results.exhibitions.map((ex) => (
                <li  onClick={() => router.push(`/dashboard/user/${uid}/events/${ex.id}`)} key={ex.id}>
                  <div className="font-semibold">{ex.title}</div>
                  <div className="text-sm opacity-50">{ex.type}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No results */}
        {query && results.profiles.length === 0 && results.exhibitions.length === 0 && (
          <div className="text-center opacity-40 mt-10">Opps Found Nothing</div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;




// ...rest of your imports

