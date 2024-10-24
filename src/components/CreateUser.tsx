import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

export interface User {
  id: string;
  roomId: string;
  name: string;
}

export interface createUserRequest {
  roomID: string;
  displayName: string;
  optionContent: string;
}

const CreateUser: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [option, setOption] = useState<string>("");
  const [userID, setUserID] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>("");
  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID");

  const requestCreateUserWithOption = async () => {
    try {
      if (roomID) {
        const requestBody: createUserRequest = {
          roomID: roomID,
          displayName: displayName,
          optionContent: option,
        };
        const response = await fetch("http://localhost:8080/userOption", {
          method: "POST",
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: User = await response.json();
        setUserID(result.id);
        console.log(result);
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create User</h1>
      <div style={{ marginBottom: "20px" }}>
        {!userID && (
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <input
              type="text"
              placeholder="Enter your option"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              style={{ marginRight: "10px" }}
            />

            <button onClick={() => requestCreateUserWithOption()}>
              Create User
            </button>
          </div>
        )}
      </div>
      {userID && (
        <Link to={"/wait-to-vote" + "?roomID=" + roomID + "&userID=" + userID}>
          Continue
        </Link>
      )}
    </div>
  );
};

export default CreateUser;
