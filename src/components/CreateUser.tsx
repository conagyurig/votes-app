import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChevronLeft, Copy } from "lucide-react";
import { API_USER_ENDPOINT, getRoomURL } from "@/utils/constants";

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
  const [_, setError] = useState<string>("");
  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID") ?? "";
  const navigate = useNavigate();

  const roomURL = getRoomURL(roomID);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(roomURL)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  const requestCreateUserWithOption = async () => {
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
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-xl min-w-[200px] px-20">
        <h1 className="text-2xl text-center pt-8 pb-20">Create User</h1>
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
          <Button onClick={requestCreateUserWithOption}>Continue</Button>
        </div>
        <div className="pt-20">
          <h3 className="text-lg font-bold">Your room link: </h3>
          <div>
            <p
              onClick={handleCopy}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
              }}
              className="text-sm font-mono break-all w-full"
            >
              {roomURL}
            </p>
            <Copy />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
