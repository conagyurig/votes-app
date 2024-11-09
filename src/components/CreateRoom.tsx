import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { API_ROOMS_ENDPOINT } from "@/utils/constants";

export interface Room {
  id: string;
  name: string;
}

export interface CreateRoomRequest {
  roomName: string;
}

const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [_, setError] = useState<string>("");
  const navigate = useNavigate();

  const requestCreateRoom = async () => {
    setLoading(true);
    console.log(loading);
    try {
      const requestBody: CreateRoomRequest = { roomName };
      const response = await fetch(API_ROOMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error("Failed to create room.");
      }
      const result: Room = await response.json();
      navigate(`/create-user?roomID=${result.id}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      console.error("Error creating room:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-xl min-w-[200px] px-20">
        <h1 className="text-2xl text-center pt-8 pb-20">Create Room</h1>
        <div className="flex flex-col">
          <h2>
            Room Name: <span className="text-red-700">*</span>
          </h2>
          <Input
            type="text"
            placeholder="Enter your room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="mb-4"
          />
          <Button className="mb-10" onClick={requestCreateRoom}>
            Create
          </Button>
          <div>
            <div>{"Steps"}</div>
            <div>{"1) Create a room"}</div>
            <div>{"2) Create your user"}</div>
            <div>{"3) Add your availability"}</div>
            <div>{"4) Vote for an event"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
