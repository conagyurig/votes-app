import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { API_ROOMS_ENDPOINT } from "@/utils/constants";
import toast from "react-hot-toast";

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
    if (roomName.length == 0) {
      toast.error("Please fill in required fields");
      return;
    }
    if (roomName.length > 20) {
      toast.error("Maximum of 20 characters");
      return;
    }
    setLoading(true);
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
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-70">
              <DotLoader color={"#591c87"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
