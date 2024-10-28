import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export interface Room {
  id: string;
  name: string;
}

export interface createRoomRequest {
  roomName: string;
}

const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState<string>("");
  const [roomID, setRoomID] = useState<string | undefined>(undefined);
  const [_, setError] = useState<string>("");
  const navigate = useNavigate();

  const requestCreateRoom = async () => {
    try {
      const requestBody: createRoomRequest = { roomName: roomName };
      const response = await fetch("/api/rooms", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result: Room = await response.json();
      setRoomID(result.id);
      console.log(result);
      navigate("/create-user" + "?roomID=" + result.id);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div>
        <h1 className="text-2xl text-center pt-8 pb-60">Create Room</h1>
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
          {!roomID && (
            <Button onClick={() => requestCreateRoom()}>Create</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
