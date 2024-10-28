import React, { useState, useEffect, useRef } from "react";
import { User } from "./CreateUser";
import { useSearchParams } from "react-router-dom";
import { ChartOption, PieChartComponent, PieChartProps } from "./ui/pie-chart";

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

  let [searchParams] = useSearchParams();
  let roomID = searchParams.get("roomID");
  let userID = searchParams.get("userID");

  const pieChartOption: ChartOption = {
    content: "fi",
    votes: 2,
  };
  const pieChartProps: PieChartProps = {
    options: [pieChartOption, pieChartOption, pieChartOption],
  };
  useEffect(() => {
    const fetchRoomState = async () => {
      try {
        if (roomID) {
          const response = await fetch("/api/roomState?roomID=" + roomID);
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
          const response = await fetch("/api/dates?roomID=" + roomID);
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Results</h1>
      {roomState && (
        <div>
          <h2>{"Room: " + roomState.roomName}</h2>
          <div>
            <PieChartComponent {...pieChartProps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
