import React, { useState, useEffect, useRef } from "react";
import { User } from "./CreateUser";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface Option {
  id: string;
  roomId: string;
  userId: string;
  content: string;
}

interface Vote {
  id: string;
  optionId: string;
  userId: string;
}

interface RoomState {
  roomName: string;
  users: User[];
  options: Option[];
  votes: Vote[];
}

const WaitToVotePage: React.FC = () => {
  const [roomState, setRoomState] = useState<RoomState | undefined>(undefined);
  const [option, setOption] = useState<string | undefined>(undefined);

  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID");
  let userID = searchParams.get("userID");

  const handleOptionChange = (value: string) => {
    setOption(value);
    console.log("Selected option:", value);
  };

  useEffect(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type: "vote", optionID: option });
      ws.current.send(message);
    }
  }, [option]);

  useEffect(() => {
    if (
      roomState &&
      roomState.votes &&
      roomState.users &&
      roomState.votes.length === roomState.users.length
    ) {
      navigate("/new-page");
    }
  }, [roomState, navigate]);

  useEffect(() => {
    const fetchRoomState = async () => {
      try {
        if (roomID) {
          const response = await fetch(
            "http://localhost:8080/roomState?roomID=" + roomID
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result: RoomState = await response.json();
          setRoomState(result);
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchRoomState();
    ws.current = new WebSocket(
      "ws://localhost:8080/ws?roomID=" + roomID + "&userID=" + userID
    );

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as RoomState;
      setRoomState(data);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [roomID, userID]);

  function findVoteCheck(userId: string) {
    return roomState?.votes?.some((vote) => vote.userId === userId) ?? false;
  }

  function findVote(userId: string) {
    return (
      roomState?.votes?.find((vote) => vote.userId === userId) ?? undefined
    );
  }

  useEffect(() => {
    if (userID) {
      setOption(findVote(userID)?.optionId);
    }
  }, [roomState]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vote</h1>
      {roomState && (
        <div>
          <h2>{"Room name: " + roomState.roomName}</h2>
          <div>
            <RadioGroup
              value={option}
              onValueChange={handleOptionChange}
              className="flex flex-col space-y-1"
            >
              {roomState.options.map((option) => (
                <div className="flex items-center space-x-2" key={option.id}>
                  <RadioGroupItem value={option.id} id="r1" />
                  <Label htmlFor="r1">{option.content}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <h3>Users in room:</h3>
          <ul>
            {roomState.users.map((user) => (
              <li key={user.id}>
                <span>
                  {user.name}
                  <div>{findVoteCheck(user.id) ? "based" : "cringe"}</div>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WaitToVotePage;
