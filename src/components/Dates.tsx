import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CopyURL from "./ui/copyURL";
import { ArrowLeft } from "lucide-react";
import { DatesState, TokenPayload } from "@/utils/types";
import { jwtDecode } from "jwt-decode";
import { getRoomURL } from "@/utils/constants";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";

const Availability: React.FC = () => {
  const [datesState, setDatesState] = useState<DatesState | undefined>(
    undefined
  );

  const [userID, setUserID] = useState<string | undefined>(undefined);
  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID") ?? "";
  const userToken = roomID ? localStorage.getItem(roomID) : "";
  const navigate = useNavigate();

  useEffect(() => {
    if (roomID && userToken && userToken.length != 0) {
      const decoded = jwtDecode<TokenPayload>(userToken);
      setUserID(decoded.user_id);
    }
  }, []);

  useEffect(() => {
    const fetchDatesState = async () => {
      try {
        if (roomID) {
          const response = await fetch("/api/dates?roomID=" + roomID, {
            headers: new Headers({
              Authorization: "Bearer " + userToken,
            }),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result: DatesState = await response.json();
          setDatesState(result);
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchDatesState();
  }, [roomID, userID]);

  return (
    <div className="pt-topPadding flex justify-center min-h-screen">
      <div className="w-full max-w-xl min-w-[200px] px-10">
        <div className="flex items-center pt-8 pb-20 relative">
          <button
            onClick={() => navigate("/create-user" + "?roomID=" + roomID)}
            className="flex absolute left-0"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl text-center mx-auto">All Dates</h1>
        </div>
        {datesState && (
          <Accordion type="single" collapsible className="w-full">
            {datesState.dates.map((dateUser) => (
              <AccordionItem value={dateUser.date}>
                <AccordionTrigger>{dateUser.date}</AccordionTrigger>
                <AccordionContent>
                  {dateUser.users.map((user) => (
                    <span key={user}>{user}</span>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default Availability;
