import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChartOption, PieChartComponent, PieChartProps } from "./ui/pie-chart";
import { BarChartOption, BarChartProps } from "./ui/barChart";
import { jwtDecode } from "jwt-decode";
import { HorizontalBarChartComponent } from "./ui/horizontalBarChart";
import DotLoader from "react-spinners/DotLoader";
import { DatesState, RoomState, TokenPayload } from "@/utils/types";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (roomID && userToken && userToken.length != 0) {
      const decoded = jwtDecode<TokenPayload>(userToken);
      setUserID(decoded.user_id);
    }
  }, []);

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
      {!roomState && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-70">
          <DotLoader color={"#591c87"} />
        </div>
      )}
      <div className="w-full max-w-xl min-w-[200px] px-2">
        {roomState && (
          <div>
            <div className="mb-4">
              {pieChartProps && <PieChartComponent {...pieChartProps} />}
            </div>
            {barChartProps && (
              <div className="mb-4">
                <HorizontalBarChartComponent {...barChartProps} />
              </div>
            )}
            <div>
              <button
                onClick={() => navigate("/dates" + "?roomID=" + roomID)}
                className="flex absolute right-5"
              >
                See all dates
              </button>
            </div>
          </div>
        )}
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

    barChartProps.dates.push(barChartOption);
  });
  return barChartProps;
}
