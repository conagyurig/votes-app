import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

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
  const [error, setError] = useState<string>("");

  const requestCreateRoom = async () => {
    try {
      const requestBody: createRoomRequest = { roomName: roomName };
      const response = await fetch("http://localhost:8080/rooms", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result: Room = await response.json();
      setRoomID(result.id);
      console.log(result);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Room</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter your room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        {!roomID && (
          <button onClick={() => requestCreateRoom()}>Create New Room</button>
        )}
      </div>
      {roomID && (
        <Link to={"/create-user" + "?roomID=" + roomID}>Create User</Link>
      )}
    </div>
  );
};

export default CreateRoom;
