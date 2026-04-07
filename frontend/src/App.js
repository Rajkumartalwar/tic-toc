import React, { useEffect, useState } from "react";
import { initSocket, client } from "./nakama";

function App() {
  const [socket, setSocket] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");

  useEffect(() => {
    async function start() {
      const s = await initSocket();
      setSocket(s);

      const match = await client.createMatch();
      setMatchId(match.match_id);

      await s.joinMatch(match.match_id);

      s.onmatchdata = (data) => {
        const state = JSON.parse(
          new TextDecoder().decode(data.data)
        );
        setBoard(state.board);
        setTurn(state.turn);
      };
    }

    start();
  }, []);

  const makeMove = (i) => {
    if (!socket || board[i] !== "") return;
    socket.sendMatchState(matchId, 1, { position: i });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Multiplayer Tic Tac Toe</h2>
      <h3>Turn: {turn}</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          justifyContent: "center",
        }}
      >
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => makeMove(i)}
            style={{
              height: 100,
              fontSize: 24,
              border: "1px solid black",
            }}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
