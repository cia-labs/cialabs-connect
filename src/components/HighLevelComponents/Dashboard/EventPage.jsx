import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse" key={Math.random()}>
      <div className="w-[27vw] h-[16vh] bg-gray-200/30 rounded-[7px] flex items-center justify-center" />
      <div className="mt-2 h-5 w-2/3 bg-gray-200/50 rounded" />
      <div className="mt-1 h-3 w-1/3 bg-gray-200/30 rounded" />
    </div>
  );
}

export default function EventPage({ uid }) {
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data/exhibitions")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  // Group events by type
  const groupedEvents = events.reduce((acc, event) => {
    acc[event.type] = acc[event.type] || [];
    acc[event.type].push(event);
    return acc;
  }, {});

  return (
    <div className="flex flex-col mt-[3vh] pl-7 lg:pl-[10vw] lg:pr-[10vw]">
      <h1 className=" mt-2 mb-6 text-2xl font-semibold">Our Exhibitions</h1>
      {loading ? (
        // Show skeletons for 2 types, 3 cards each as a placeholder
        <>
          {[1, 2].map((_, idx) => (
            <section key={idx} className="mb-8">
              <div className="text-[1rem] font-bold opacity-40 mb-6">
                &nbsp;
              </div>
              <div className="z-30 overflow-x-scroll flex flex-row gap-5">
                {[1, 2, 3].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </section>
          ))}
        </>
      ) : (
        Object.entries(groupedEvents).map(([type, eventsOfType]) => (
          <section key={type} className="mb-8">
            <h2 className="text-[1rem] font-bold opacity-40 mb-6">{type}</h2>
            <div className="z-30 overflow-x-scroll flex flex-row gap-5">
              {eventsOfType.map((event) => (
                <div
                  onClick={() => {
                    router.push(`/dashboard/user/${uid}/events/${event.id}`);
                  }}
                  className="flex flex-col"
                  key={event.id}
                >
                  <div className="w-[27vw] h-[16vh] bg-white/10 rounded-[7px] overflow-hidden flex items-center justify-center">
                    <Image
                      src={event.image_url}
                      alt=""
                      width={600}
                      height={400}
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                  <h1 className="mt-2 text-lg font-medium">{event.title}</h1>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
