import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { API_AVAILABILITY_ENDPOINT, getRoomURL } from "@/utils/constants";
import CopyURL from "./ui/copyURL";

export interface User {
  id: string;
  roomId: string;
  name: string;
}

export interface CreateAvailabilityRequest {
  roomID: string;
  dates: string[];
}

const Availability: React.FC = () => {
  const [dates, setDates] = React.useState<Date[] | undefined>([]);

  const [_, setError] = useState<string>("");
  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID") ?? "";
  const navigate = useNavigate();

  const userToken = roomID ? localStorage.getItem(roomID) : "";

  const roomURL = getRoomURL(roomID);

  const requestCreateUserWithOption = async () => {
    if (dates) {
      const formattedDates: string[] = dates?.map((value) => {
        return value.toISOString().split("T")[0];
      });
      try {
        if (roomID && userToken && formattedDates) {
          const requestBody: CreateAvailabilityRequest = {
            roomID: roomID,
            dates: formattedDates,
          };
          const response = await fetch(API_AVAILABILITY_ENDPOINT, {
            headers: new Headers({
              Authorization: "Bearer " + userToken,
            }),
            method: "POST",
            body: JSON.stringify(requestBody),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          navigate("/wait-to-vote" + "?roomID=" + roomID);
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-xl min-w-[200px] px-10">
        <h1 className="text-2xl text-center pt-8 pb-20">Availability</h1>
        <div className="flex justify-center items-center flex-col">
          <h2 className="mb-4 text-center">
            Choose your availability: <span className="text-red-700">*</span>
          </h2>

          <Calendar
            mode="multiple"
            selected={dates}
            onSelect={setDates}
            className="rounded-md border mx-auto mb-4"
          />
          <Button className="max-w-min" onClick={requestCreateUserWithOption}>
            Continue
          </Button>
        </div>
        <div>
          <CopyURL roomURL={roomURL} />
        </div>
      </div>
    </div>
  );
};

export default Availability;
