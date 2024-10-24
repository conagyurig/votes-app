import React, { useState, useEffect, useRef } from "react";

interface VoteCounts {
  a: number;
  b: number;
  c: number;
}

const VotingPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({
    a: 0,
    b: 0,
    c: 0,
  });
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/ws");

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if ("a" in data && "b" in data && "c" in data) {
        setVoteCounts(data);
      } else {
        console.log("Received unknown data:", data);
      }
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
  }, []);

  const sendVote = (option: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const vote = {
        username: username.trim(),
        option: option,
      };
      ws.current.send(JSON.stringify(vote));
    } else {
      console.error("WebSocket is not open");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Real-Time Voting App</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px" }}
        />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => sendVote("a")} disabled={!username}>
          Vote for Option A
        </button>
        <button onClick={() => sendVote("b")} disabled={!username}>
          Vote for Option B
        </button>
        <button onClick={() => sendVote("c")} disabled={!username}>
          Vote for Option C
        </button>
      </div>
      <h2>Vote Counts:</h2>
      <ul>
        <li>Option A: {voteCounts.a}</li>
        <li>Option B: {voteCounts.b}</li>
        <li>Option C: {voteCounts.c}</li>
      </ul>
    </div>
  );
};

export default VotingPage;
