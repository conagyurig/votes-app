import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { API_USER_ENDPOINT, getRoomURL } from "@/utils/constants";
import toast from "react-hot-toast";
import CopyURL from "./ui/copyURL";
import { ArrowLeft, RefreshCwIcon } from "lucide-react";

export interface User {
  id: string;
  roomId: string;
  name: string;
}

export interface CreateUserRequest {
  roomID: string;
  displayName: string;
  optionContent: string;
}

const autoSuggestions = [
  "bar",
  "club",
  "spoons", // Wetherspoons pub
  "dinner",
  "library",
  "cafe",
  "karaoke night",
  "bowling",
  "cinema",
  "escape room",
  "pub quiz night",
  "bottomless brunch",
  "house party",
  "theatre show",
  "food market",
  "live gig",
  "board game cafe",
  "open mic night",
  "charity fundraiser night",
  "football match",
  "rugby match",
  "comedy club",
  "theme park day trip",
  "paintball",
  "go-karting",
  "street food festival",
  "beach day",
  "bingo night",
  "art exhibition",
  "museum visit",
  "salsa dancing class",
  "roller disco",
  "mini golf",
  "afternoon tea",
  "hiking trip",
  "cultural food tour",
  "trampoline park",
  "shopping spree",
  "afternoon pub crawl",
  "silent disco",
  "gaming arcade",
  "charity fun run",
  "pottery class",
  "ghost tour",
  "whisky tasting",
  "sports club social",
  "pool or snooker night",
  "spa day",
  "night-time stargazing",
  "open air cinema",
  "visiting a botanical garden",
];

const CreateUser: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [option, setOption] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>(
    getRandSuggestions(autoSuggestions)
  );
  const [_, setError] = useState<string>("");
  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID") ?? "";
  const navigate = useNavigate();

  const roomURL = getRoomURL(roomID);

  const requestCreateUserWithOption = async () => {
    if (displayName.length == 0 || option.length == 0) {
      toast.error("Please fill in required fields");
      return;
    }
    try {
      if (roomID) {
        const requestBody: CreateUserRequest = {
          roomID: roomID,
          displayName: displayName,
          optionContent: option,
        };
        const response = await fetch(API_USER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: string = await response.json();
        localStorage.setItem(roomID, result);
        navigate("/availability" + "?roomID=" + roomID);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-xl min-w-[200px] px-20">
        <div className="flex items-center pt-8 pb-20 relative">
          <button className="flex absolute left-0">
            <ArrowLeft />
          </button>
          <h1 className="text-2xl text-center mx-auto">Create User</h1>
        </div>
        <div>
          <h2>
            Choose your display name: <span className="text-red-700">*</span>
          </h2>
          <Input
            type="text"
            placeholder="Enter your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mb-4"
          />
          <h2>
            Suggest an event: <span className="text-red-700">*</span>
          </h2>
          <Input
            type="text"
            placeholder="Enter your option"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <div className="flex gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  onClick={() => {
                    setOption(suggestion);
                  }}
                  variant="secondary"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
            <div className="flex ">
              <Button
                className="mt-4"
                onClick={() =>
                  setSuggestions(getRandSuggestions(autoSuggestions))
                }
                variant="outline"
                size="icon"
              >
                <RefreshCwIcon />
              </Button>
            </div>
          </div>
          <div className="flex justify-start ">
            <Button
              className="rounded-full"
              onClick={requestCreateUserWithOption}
            >
              Continue
            </Button>
          </div>
        </div>
        <CopyURL roomURL={roomURL} />
      </div>
    </div>
  );
};

export default CreateUser;

function getRandSuggestions(suggestions: string[]) {
  const max = suggestions.length - 3;
  const start = Math.floor(Math.random() * max);
  const end = start + 3;
  return suggestions.slice(start, end);
}
