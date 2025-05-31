import React, { useEffect, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { MyImage } from "@/components/Image/Image";
import { useRouter } from "next/navigation";


export default function Events({uid}) {
  const router = useRouter()
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data/exhibitions")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data)
        console.log(data)
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);
    console.log("ds" + events.image_url)

  return (
    <div className="flex flex-col mt-[3vh] pl-7 lg:pl-[10vw] lg:pr-[10vw]">
      <a href={`/dashboard/user/${uid}/events`} className="text-[1rem] font-bold opacity-40 ">
        Our Events <NavigateNextIcon />
      </a>
      <div className="mt-[2vh] z-30 overflow-x-scroll flex flex-row gap-5 ">
        {loading ? (
          <div className="text-lg font-medium opacity-60">Loading...</div>
        ) : (
          events.map((event) => (
            <div onClick={() => {
              router.push(`/dashboard/user/${uid}/events/${event.id}`)
            }} className="flex flex-col" key={event.id}>
              <div className="w-[27vw] h-[16vh] bg-white/10 rounded-[7px] overflow-hidden flex items-center justify-center">
                <MyImage
                  src={event.image_url}
                  alt=""
                  w={333}
                  h={600}
                  
                />
              </div>
              <h1 className="mt-2 text-lg font-medium">{event.title}</h1>
              <p className="mt-1 text-xs opacity-40 font-medium ">
                {event.type}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
