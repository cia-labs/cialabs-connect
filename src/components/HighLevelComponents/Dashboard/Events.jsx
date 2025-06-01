import React, { useEffect, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { MyImage } from "@/components/Image/Image";
import { useRouter } from "next/navigation";
import Link from "next/link";

function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse" key={Math.random()}>
      <div className="w-[120px] h-[135px] bg-gray-200/30 rounded-[7px] flex items-center justify-center" />
      <div className="mt-2 h-5 w-2/3 bg-gray-200/50 rounded" />
      <div className="mt-1 h-3 w-1/3 bg-gray-200/30 rounded" />
    </div>
  );
}

export default function Events({ uid }) {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to compare arrays of objects (simple shallow check)
  const isSameData = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  useEffect(() => {
    const cached = localStorage.getItem("events");
    if (cached) {
      setEvents(JSON.parse(cached));
      setLoading(false);
    }

    fetch("/api/data/exhibitions")
      .then((res) => res.json())
      .then((data) => {
        // Only update if data has changed
        if (!isSameData(data, cached ? JSON.parse(cached) : [])) {
          setEvents(data);
          localStorage.setItem("events", JSON.stringify(data));
        }
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col mt-[4vh] pl-7 lg:pl-[10vw] lg:pr-[10vw]">
      <a href={`/dashboard/user/${uid}/events`} className="text-[1rem] font-bold opacity-40 ">
        Our Exhibitions <NavigateNextIcon />
      </a>
      <div className="mt-[2vh] z-30 overflow-x-scroll flex flex-row gap-5 ">
        {loading ? (
          // Show 3 skeleton cards while loading
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          events.map((event) => (
            <button
              
              onClick={() => {
                history.pushState(null, "", `/dashboard/user/${uid}/events/${event.id}`)
                location.reload()
              }}
              className="flex flex-col text-start"
              key={event.id}
            >
              <div className="w-[120px] h-[135px] bg-white/10 rounded-[7px] overflow-hidden flex items-center justify-center">
                <MyImage src={event.image_url} alt="" w={333} h={600} />
              </div>
              <h1 className="mt-2 text-lg font-medium">{event.title}</h1>
              <p className="mt-1 text-xs opacity-40 font-medium ">
                {event.type}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
