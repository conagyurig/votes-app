import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

export interface User {
  id: string;
  roomId: string;
  name: string;
}

export interface createAvailabilityRequest {
  roomID: string;
  userID: string;
  dates: string[];
}

const Availability: React.FC = () => {
  const [dates, setDates] = React.useState<Date[] | undefined>([]);

  const [_, setError] = useState<string>("");
  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID");
  let userID = searchParams.get("userID");

  const navigate = useNavigate();

  const requestCreateUserWithOption = async () => {
    if (dates) {
      const formattedDates: string[] = dates?.map((value) => {
        return value.toISOString().split("T")[0];
      });
      try {
        if (roomID && userID && formattedDates) {
          const requestBody: createAvailabilityRequest = {
            roomID: roomID,
            userID: userID,
            dates: formattedDates,
          };
          const response = await fetch(
            "http://localhost:8080/userAvailability",
            {
              method: "POST",
              body: JSON.stringify(requestBody),
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          navigate("/wait-to-vote" + "?roomID=" + roomID + "&userID=" + userID);
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl pt-8 pb-20">Availability</h1>
        <div className="mx-10">
          <h2 className="mb-4">
            Choose your availability: <span className="text-red-700">*</span>
          </h2>
          <Calendar
            mode="multiple"
            selected={dates}
            onSelect={setDates}
            className="rounded-md border mx-auto mb-4"
          />
          <Button onClick={() => requestCreateUserWithOption()}>
            Continue
          </Button>
        </div>
      </div>

      <div className="w-full px-6 mt-10 text-left overflow-x-auto">
        <h3 className="text-lg font-bold">Your room link:</h3>
        <div className="text-sm font-mono break-all w-full">
          {"https://whenru3-be-252801953050.europe-west2.run.app/create-user?roomID=" +
            roomID}
        </div>
      </div>
    </div>
  );
};

export default Availability;
