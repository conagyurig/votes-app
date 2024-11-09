import React, { useState, useEffect } from "react";
import { User } from "./CreateUser";
import { useSearchParams } from "react-router-dom";
import { ChartOption, PieChartComponent, PieChartProps } from "./ui/pie-chart";
import {
  BarChartComponent,
  BarChartOption,
  BarChartProps,
} from "./ui/barChart";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "./WaitToVote";
import { HorizontalBarChartComponent } from "./ui/horizontalBarChart";

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

interface DatesState {
  roomId: string;
  dates: DatesWithUsers[];
}

interface DatesWithUsers {
  date: string;
  users: string[];
}

const Results: React.FC = () => {
  const [roomState, setRoomState] = useState<RoomState | undefined>(undefined);
  const [datesState, setDatesState] = useState<DatesState | undefined>(
    undefined
  );
  const [pieChartProps, setPieChartProps] = useState<PieChartProps | undefined>(
    undefined
  );
  const [barChartProps, setBarChartProps] = useState<BarChartProps | undefined>(
    undefined
  );
  const [userID, setUserID] = useState<string | undefined>(undefined);
  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID");
  const userToken = roomID ? localStorage.getItem(roomID) : "";

  const roomURL =
    "https://whenru3-be-252801953050.europe-west2.run.app/create-user?roomID=" +
    roomID;

  useEffect(() => {
    if (roomID && userToken && userToken.length != 0) {
      const decoded = jwtDecode<TokenPayload>(userToken);
      setUserID(decoded.userID);
    }
  }, []);

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
    fetchRoomState();
  }, [roomID, userID]);

  useEffect(() => {
    const fetchDatesState = async () => {
      try {
        if (roomID) {
          const response = await fetch("/api/dates?roomID=" + roomID, {
            headers: new Headers({
              Authorization: "Bearer " + userToken,
            }),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result: DatesState = await response.json();
          setDatesState(result);
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchDatesState();
  }, [roomID, userID]);

  useEffect(() => {
    if (roomState) {
      setPieChartProps(constructPieChartProps(roomState));
    }
  }, [roomState]);

  useEffect(() => {
    if (datesState) {
      setBarChartProps(constructBarChartProps(datesState));
    }
  }, [datesState]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-xl min-w-[200px] px-2">
        <h1 className="text-2xl text-center pt-8 pb-10">Results</h1>
        <div>
          {roomState && (
            <div>
              <div className="mb-4">
                {pieChartProps && <PieChartComponent {...pieChartProps} />}
              </div>
            </div>
          )}
          {datesState && (
            <div>
              {barChartProps && (
                <div>
                  <HorizontalBarChartComponent {...barChartProps} />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-full px-6 mt-10 text-left overflow-x-auto">
          <h3 className="text-lg font-bold">Your room link:</h3>
          <div className="text-sm font-mono break-all w-full">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;

function constructPieChartProps(roomState: RoomState) {
  let pieChartProps: PieChartProps = {
    options: [],
  };
  roomState.options.map((option) => {
    const content = option.content;
    let voteCount = 0;
    roomState.votes.map((vote) => {
      if (vote.optionId === option.id) {
        voteCount++;
      }
    });
    const pieChartOption: ChartOption = { content, votes: voteCount };
    pieChartProps.options.push(pieChartOption);
  });
  return pieChartProps;
}

function constructBarChartProps(datesState: DatesState) {
  let barChartProps: BarChartProps = {
    dates: [],
  };
  datesState.dates.map((dateVotes) => {
    const barChartOption: BarChartOption = {
      date: dateVotes.date.split("-")[1] + "/" + dateVotes.date.split("-")[2],
      votes: dateVotes.users.length,
    };
    if (barChartOption.votes > 1) {
      barChartProps.dates.push(barChartOption);
    }
  });
  return barChartProps;
}
