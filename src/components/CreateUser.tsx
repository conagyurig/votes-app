import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  API_USER_ENDPOINT,
  autoSuggestions,
  getRoomURL,
} from "@/utils/constants";
import toast from "react-hot-toast";
import CopyURL from "./ui/copyURL";
import { ArrowLeft, RefreshCwIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "./WaitToVote";

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

const CreateUser: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [option, setOption] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>(
    getRandSuggestions(autoSuggestions)
  );
  const [_, setError] = useState<string>("");
  const [userID, setUserID] = useState<string | undefined>(undefined);

  let [searchParams] = useSearchParams();
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  let roomID = searchParams.get("roomID") ?? "";
  const navigate = useNavigate();
  const roomURL = getRoomURL(roomID);
  const userToken = roomID ? localStorage.getItem(roomID) : "";

  useEffect(() => {
    if (roomID && userToken && userToken.length != 0) {
      const decoded = jwtDecode<TokenPayload>(userToken);
      setUserID(decoded.user_id);
    }
  }, []);

  const handleRegenSuggestions = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
    setSuggestions(getRandSuggestions(autoSuggestions));
  };

  const requestCreateUserWithOption = async () => {
    if (displayName.length == 0 || option.length == 0) {
      toast.error("Please fill in required fields");
      return;
    }
    if (displayName.length > 20 || option.length > 20) {
      toast.error("Maximum of 20 characters");
      return;
    }
    try {
      if (roomID) {
        const requestBody: CreateUserRequest = {
          roomID: roomID,
          displayName: displayName,
          optionContent: option,
        };
        if (userID) {
          const response = await fetch(API_USER_ENDPOINT, {
            method: "PUT",
            headers: new Headers({
              Authorization: "Bearer " + userToken,
            }),
            body: JSON.stringify(requestBody),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
        } else {
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
        }
        navigate("/availability" + "?roomID=" + roomID);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-xl min-w-[200px] px-16">
        <div className="flex items-center pt-8 pb-20 relative">
          <h1 className="text-2xl text-center mx-auto">
            {userID ? "Update User" : "Create User"}
          </h1>
        </div>
        <div>
          <h2>
            {userID ? "Update your display name" : "Choose your display name"}:{" "}
            <span className="text-red-700">*</span>
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
            <div
              ref={scrollableDivRef}
              className="flex gap-2 overflow-x-auto scroll-smooth"
            >
              {suggestions.map((suggestion) => (
                <Button
                  className="mb-1"
                  onClick={() => {
                    setOption(suggestion);
                  }}
                  variant="secondary"
                >
                  {suggestion}
                </Button>
              ))}
              <Button
                className="mb-1 min-w-[38px]"
                onClick={handleRegenSuggestions}
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
