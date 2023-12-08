import React, { useEffect, useState } from "react";
import tokenService from "../services/token.service";
import "./styles/Board.css";

function Box({ content }) {
  return (
    <div className="box">
      {content ? <img src={content.image} alt="Card" /> : null}
    </div>
  );
}

function importGameCard(color, exit, iniciative) {
  let name = "";
  let exitSubstring = exit.replace("EXIT_", "").substring(0, 3);
  if (exit === "START") {
    name = "C" + color.toUpperCase()[0] + "_START";
  } else {
    if (exitSubstring === "111") {
      name = "C" + color.toUpperCase()[0] + "_111_" + iniciative;
    } else {
      name = "C" + color.toUpperCase()[0] + "_" + exitSubstring;
    }
  }
  return import(`../static/images/GameCards/${name}.png`);
}

function setHandCardsPlayer(cards, setHandCardsFunction) {
  const handCardImages = cards.map((card) => {
    const module = importGameCard(card.color, card.exit, card.iniciative);
    return module.then((mod) => ({ ...card, image: mod.default }));
  });

  Promise.all(handCardImages).then((images) => {
    setHandCardsFunction(images);
  });
}


export default function Board() {
  const jwt = tokenService.getLocalAccessToken();

  const [board, setBoard] = useState(
    Array(7)
      .fill(null)
      .map(() => Array(7).fill(null))
  );
  const gameId =
    window.location.pathname.split("/")[
    window.location.pathname.split("/").length - 1
    ];
  const [dataGamePlayer, setDataGamePlayer] = useState([]);
  const [handCardsPlayer1, setHandCardsPlayer1] = useState([]);
  const [handCardsPlayer2, setHandCardsPlayer2] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {

      async function fetchGameCards() {
        try {
          const response = await fetch(`/api/v1/cards/game/${gameId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
          });
          const responseGamePlayer = await fetch(
            `/api/v1/gameplayers/game/${gameId}`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );

          const dataGamePlayer = await responseGamePlayer.json();
          setDataGamePlayer(dataGamePlayer);
          const data = await response.json();

          const handCardsPlayer1 = data.filter(
            (card) =>
              card.color === dataGamePlayer[0].color &&
              card.card_Status === "IN_HAND"
          );
          const handCardsPlayer2 = data.filter(
            (card) =>
              card.color === dataGamePlayer[1].color &&
              card.card_Status === "IN_HAND"
          );

          setHandCardsPlayer(handCardsPlayer1, setHandCardsPlayer1);
          setHandCardsPlayer(handCardsPlayer2, setHandCardsPlayer2);

          const cardsOnBoard = data.filter((card) => card.card_Status === "ON_BOARD");

          const cardsOnBoardImages = await Promise.all(
            cardsOnBoard.map((card) =>
              importGameCard(card.color, card.exit, card.iniciative).then(
                (module) => ({ ...card, image: module.default })
              )
            )
          );

          // Actualizar el tablero con las cartas en el tablero
          setBoard((oldBoard) => {
            const newBoard = oldBoard.map((row) => row.slice());

            cardsOnBoardImages.forEach((card) => {
              if (card.color === dataGamePlayer[0].color) {
                newBoard[card.row][card.column] = { image: card.image };
              }
              if (card.color === dataGamePlayer[1].color) {
                newBoard[card.row][card.column] = { image: card.image };
              }
            });

            return newBoard;
          });

          setIsLoading(false);
        } catch (error) {
          console.error("Error al cargar las cartas", error);
        }
      }
      fetchGameCards();
    }, 1000); // Actualization every second
    return () => clearInterval(interval);
  }, [gameId, jwt]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background">
      <br />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="player-column">
          {dataGamePlayer.length > 0 ? dataGamePlayer[0].player.nickname : null}
          <br />
          {handCardsPlayer1.map((card, index) => (
            <div className="hand" key={index}>
              <img src={card.image} alt="Card" />
            </div>
          ))}
        </div>
        <div className="board">
          {board.map((row, i) => (
            <div key={i} className="row2">
              {row.map((boxContent, j) => (
                <Box key={j} content={boxContent} />
              ))}
            </div>
          ))}
        </div>
        <div className="player-column">
          {dataGamePlayer.length > 0 ? dataGamePlayer[1].player.nickname : null}
          <br />
          {handCardsPlayer2.map((card, index) => (
            <div className="hand" key={index}>
              <img src={card.image} alt="Card" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
