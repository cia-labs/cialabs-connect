'use client';

import React, { useState, useEffect } from 'react';

const ParticipantsStreakTable = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/students');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setParticipants(data); // Supabase route returns array directly
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[#0b0b0d] rounded-2xl border border-[#222] shadow-lg">
          <div className="font-mono text-sm text-[#7fffd4]">── fetch 50Days Sessions</div>
          <div className="mt-4 text-slate-300 font-mono">Loading…</div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[#0b0b0d] rounded-2xl border border-[#3b1f1f] shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <div className="font-mono text-sm text-red-400">Error</div>
          </div>
          <div className="mt-4 text-sm text-red-200 font-mono">{error}</div>
        </div>
      </div>
    );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Editor-like wrapper */}
        <div className="bg-[#060607] border border-[#1f2937] rounded-2xl overflow-hidden shadow-2xl">
          {/* Top bar (tabs + window controls) */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-[#111] bg-gradient-to-b from-[#080808] to-[#050505]">
            <div className="flex items-center gap-3">
              {/* Window dots */}
              <div className="flex gap-2 items-center">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#28c840] inline-block" />
              </div>

              {/* Fake file tabs: collapse to one on small screens */}
              <div className="ml-3 flex items-center gap-2">
                <div className="px-2 sm:px-3 py-1 rounded-md bg-[#0f1720] text-xs sm:text-xs font-mono text-[#7dd3fc] border border-[#10323b]">
                  index.js
                </div>
                <div className="hidden sm:inline px-3 py-1 rounded-md text-xs font-mono text-[#9ca3af]">students.json</div>
                <div className="hidden lg:inline px-3 py-1 rounded-md text-xs font-mono text-[#9ca3af]">styles.css</div>
              </div>
            </div>

            <div className="text-xs font-mono text-[#94a3b8]">Tech Streaks • live</div>
          </div>

          {/* Main content: code-like table area */}
          <div className="flex flex-col md:flex-row">
            {/* Gutter (line numbers) - hidden on small screens */}
            <div className="hidden md:block w-12 bg-[#0b0c0d] border-r border-[#111] py-4">
              <div className="font-mono text-xs text-[#475569] pl-3">
                {participants.map((_, i) => (
                  <div key={i} className="leading-7 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>

            {/* "Editor" content */}
            <div className="flex-1 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 rounded text-xs font-mono bg-[#071018] border border-[#082233] text-[#8be9fd]">GET /api/CiaLabs</div>
                  <div className="text-xs font-mono text-[#94a3b8]">Status: <span className="ml-2 text-[#7fffd4]">200 OK</span></div>
                </div>
                <div className="text-xs font-mono text-[#94a3b8]">Updated just now</div>
              </div>

              <div className="rounded-lg border border-[#111827] bg-gradient-to-b from-[#081018] to-[#041018] p-3">
                {/* Table header like code comment */}
                <div className="mb-3 text-xs font-mono text-[#94a3b8]">/* Participants streak — derived from 50days Sessions */</div>

                {/* Desktop/table view (md+) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full table-fixed font-mono text-sm text-[#cbd5e1]">
                    <thead>
                      <tr className="text-xs text-[#94a3b8]">
                        <th className="w-12 px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Name / USN</th>
                        <th className="w-48 px-3 py-2 text-left">Current Streak</th>
                        <th className="w-48 px-3 py-2 text-left">Highest Streak</th>
                      </tr>
                    </thead>

                    <tbody>
                      {participants.map((p, index) => (
                        <tr
                          key={p.usn || index}
                          className={index % 2 === 0 ? 'bg-[linear-gradient(90deg,#071018,transparent)]' : 'bg-[linear-gradient(90deg,#041018,transparent)]'}
                        >
                          <td className="px-3 py-3 align-top text-[#9fb7c5]">{index + 1}</td>

                          <td className="px-3 py-3 align-top">
                            <div className="flex items-baseline justify-between">
                              <div>
                                <div className="text-[#e6f6ff] font-semibold">{p.name}</div>
                                <div className="text-xs text-[#8b98a6]">{p.usn}</div>
                              </div>
                              <div className="ml-4 text-xs font-mono text-[#7f8b99]" />
                            </div>
                          </td>

                          <td className="px-3 py-3 align-top">
                            <div className="inline-flex items-center gap-2">
                              <span className="px-2 py-1 rounded-md text-sm font-mono bg-[#001422] border border-[#00334a] text-[#66e0ff]">
                                {p.current_streak}
                              </span>
                              {/* visual sparkline-like bar (purely UI) */}
                              <div className="h-2 w-24 bg-[#02262b] rounded overflow-hidden" aria-hidden>
                                <div
                                  style={{ width: `${Math.min(100, (p.current_streak || 0) * 10)}%` }}
                                  className="h-full bg-gradient-to-r from-[#00bcd4] to-[#00aaff]"
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3 align-top">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-md text-sm font-mono bg-[#221202] border border-[#44220a] text-[#ffd080]">
                                {p.highest_streak}
                              </span>
                              <div className="text-sm" role="img" aria-label="fire">🔥</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/cards view (sm - md) */}
                <div className="md:hidden space-y-3">
                  {participants.map((p, idx) => (
                    <div key={p.usn || idx} className="bg-[#071018] border border-[#0f2630] rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-shrink-0">
                          <div className="font-mono text-xs text-[#94a3b8]">#{String(idx + 1).padStart(2, '0')}</div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold text-[#e6f6ff]">{p.name}</div>
                              <div className="text-xs text-[#8b98a6] font-mono">{p.usn}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-mono text-[#94a3b8]">Highest</div>
                              <div className="mt-1 inline-flex items-center gap-2">
                                <span className="px-2 py-1 rounded-md text-sm font-mono bg-[#221202] border border-[#44220a] text-[#ffd080]">
                                  {p.highest_streak}
                                </span>
                                <div role="img" aria-label="fire">🔥</div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-md text-sm font-mono bg-[#001422] border border-[#00334a] text-[#66e0ff]">
                                {p.current_streak}
                              </span>
                              <div className="h-2 w-28 bg-[#02262b] rounded overflow-hidden" aria-hidden>
                                <div
                                  style={{ width: `${Math.min(100, (p.current_streak || 0) * 10)}%` }}
                                  className="h-full bg-gradient-to-r from-[#00bcd4] to-[#00aaff]"
                                />
                              </div>
                            </div>
                            <div className="text-xs font-mono text-[#94a3b8]">streak</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* If empty (just in-case) */}
                {participants.length === 0 && (
                  <div className="p-4 font-mono text-sm text-[#94a3b8]">/* no participants found */</div>
                )}
              </div>

              {/* Footer like terminal output */}
              <div className="mt-4 flex items-center justify-between text-xs text-[#7dd3fc] font-mono">
                <div>
                  <span className="hidden sm:inline">console.log('rendered participants:')</span>{' '}
                  <span className="font-mono text-[#94a3b8]">{participants.length}</span>
                </div>
                <div className="text-[#94a3b8] text-right">
                  <span className="hidden sm:inline">Rendered at</span>{' '}
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* max-width */}
    </div>
  );
};

export default ParticipantsStreakTable;
