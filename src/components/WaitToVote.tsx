import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "./CreateUser";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import CopyURL from "./ui/copyURL";
import { getRoomURL } from "@/utils/constants";
import DotLoader from "react-spinners/DotLoader";
import { ArrowLeft } from "lucide-react";

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
  revealVotes: boolean;
}

export interface TokenPayload {
  user_id: string;
  room_id: string;
}

const WaitToVotePage: React.FC = () => {
  const [roomState, setRoomState] = useState<RoomState | undefined>(undefined);
  const [option, setOption] = useState<string | undefined>(undefined);
  const [userID, setUserID] = useState<string | undefined>(undefined);

  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID") ?? "";
  const userToken = roomID ? localStorage.getItem(roomID) : "";

  const roomURL = getRoomURL(roomID);

  useEffect(() => {
    if (roomID && userToken && userToken.length != 0) {
      const decoded = jwtDecode<TokenPayload>(userToken);
      setUserID(decoded.user_id);
    }
  }, []);

  const handleOptionChange = (value: string) => {
    setOption(value);
  };

  useEffect(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type: "vote", optionID: option });
      ws.current.send(message);
    }
  }, [option]);

  const revealVotes = async () => {
    if (
      roomState &&
      roomState.users?.length > 1 &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      const message = JSON.stringify({ type: "revealVotes" });
      ws.current.send(message);
    }
  };

  useEffect(() => {
    const fetchRoomState = async () => {
      try {
        if (roomID) {
          const response = await fetch("/api/roomState?roomID=" + roomID, {
            headers: new Headers({
              Authorization: "Bearer " + userToken,
            }),
          });
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
    if (userToken) {
      fetchRoomState();
      const encodedToken = encodeURIComponent(userToken);
      ws.current = new WebSocket(
        "wss://whenru3-be-252801953050.europe-west2.run.app/ws?roomID=" +
          // "ws://localhost:8080/ws?roomID=" +
          roomID +
          "&token=" +
          encodedToken
      );

      ws.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.current.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data) as RoomState;
        setRoomState(data);
        if (data.revealVotes == true) {
          navigate("/results?roomID=" + roomID);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [roomID, userToken]);

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
    <div className="pt-topPadding flex justify-center min-h-screen">
      {!roomState && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-70">
          <DotLoader color={"#591c87"} />
        </div>
      )}
      {roomState && (
        <div className="w-full max-w-xl min-w-[200px] px-20">
          <div className="flex items-center pt-8 pb-20 relative">
            <button
              onClick={() => navigate("/availability" + "?roomID=" + roomID)}
              className="flex absolute left-0"
            >
              <ArrowLeft />
            </button>
            <h1 className="text-2xl text-center mx-auto">
              {toTitleCase(roomState.roomName)}
            </h1>
          </div>
          <div className="flex justify-center items-center flex-col">
            <h2 className="text-lg mb-4">Select your vote:</h2>
            <div className="">
              <RadioGroup
                value={option}
                onValueChange={handleOptionChange}
                className="space-y-4"
              >
                {roomState.options.map((option) => (
                  <div className="flex items-center space-x-4" key={option.id}>
                    <button
                      onClick={() => {
                        handleOptionChange(option.id);
                      }}
                    >
                      <Card className="w-full p-3 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                          <Label className="ml-4 text-m">
                            {option.content}
                          </Label>
                        </div>
                      </Card>
                    </button>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <h3 className="text-lg mt-10">Users:</h3>
            <ul>
              {roomState.users.map((user) => (
                <li key={user.id} className="flex items-center space-x-2">
                  <span>{user.name}</span>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      findVoteCheck(user.id) ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </li>
              ))}
            </ul>
            <Button className="mt-10 max-w-min" onClick={revealVotes}>
              Reveal Votes
            </Button>
            <CopyURL roomURL={roomURL} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitToVotePage;

function toTitleCase(str: String) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}
