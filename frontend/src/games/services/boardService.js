/* Board Service
 * =============
 * Script to manage the board of the game. The long functions of board are here.
*/

export async function fetchGameCards(gameId, jwt, setDataGamePlayer, setHandCardsPlayer1, setHandCardsPlayer2, setBoard, setIsLoading, setEnergyCards, setPlayer1CardPossiblePositions, setPlayer2CardPossiblePositions) {
    try {
      const response = await fetch(`/api/v1/games/${gameId}/cards`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      if(!response.ok) {
        throw new Error('Error al cargar las cartas.');
      }
      
      const responseGamePlayer = await fetch(
        `/api/v1/games/${gameId}/gameplayers`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!responseGamePlayer.ok) {
        throw new Error("Error al cargar los gameplayers.");
      }

      const dataGamePlayer = await responseGamePlayer.json();
      setDataGamePlayer(dataGamePlayer);
      const data = await response.json();
      const handCardsPlayer1 = data.filter(
        (card) =>
          card.color === dataGamePlayer[0].color &&
          card.cardState === "IN_HAND"
      );
      const handCardsPlayer2 = data.filter(
        (card) =>
          card.color === dataGamePlayer[1].color &&
          card.cardState === "IN_HAND"
      );
  
      setHandCardsPlayer(handCardsPlayer1, setHandCardsPlayer1);
      setHandCardsPlayer(handCardsPlayer2, setHandCardsPlayer2);
      setEnergyCards(dataGamePlayer[0].color, dataGamePlayer[1].color, setEnergyCards);
      importEnergyCards(dataGamePlayer[0].color, dataGamePlayer[1].color, setEnergyCards);
  
      const cardsOnBoard = data.filter((card) => card.cardState === "ON_BOARD");
  
      const cardsOnBoardImages = await Promise.all(
        cardsOnBoard.map((card) =>
          importGameCard(card.color, card.exit, card.initiative).then(
            (module) => ({ ...card, image: module.default, orientation: card.orientation })
          )
        )
      );
  
      // Actualizar el tablero con las cartas en el tablero
      setBoard((oldBoard) => {
        const newBoard = oldBoard.map((row) => row.slice());
  
        cardsOnBoardImages.forEach((card) => {
          if (card.color === dataGamePlayer[0].color) {
            newBoard[card.row][card.column] = { image: card.image, orientation: card.orientation };
          }
          if (card.color === dataGamePlayer[1].color) {
            newBoard[card.row][card.column] = { image: card.image, orientation: card.orientation };
          }
        });
        return newBoard;
      });

      // Actualizar las posiciones posibles de las cartas
      const responsePlayer1CardPossiblePositions = await fetch(
        `/api/v1/games/${gameId}/gameplayers/${dataGamePlayer[0].id}/cardPositions`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!responsePlayer1CardPossiblePositions.ok) {
        throw new Error("Error al cargar las posiciones posibles de las cartas del jugador 1.");
      }
      const responsePlayer2CardPossiblePositions = await fetch(
        `/api/v1/games/${gameId}/gameplayers/${dataGamePlayer[1].id}/cardPositions`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!responsePlayer2CardPossiblePositions.ok) {
        throw new Error("Error al cargar las posiciones posibles de las cartas del jugador 2.");
      }
      const cardPlayer1PossiblePositions = await responsePlayer1CardPossiblePositions.json();
      const cardPlayer2PossiblePositions = await responsePlayer2CardPossiblePositions.json();
      setPlayer1CardPossiblePositions(cardPlayer1PossiblePositions);
      setPlayer2CardPossiblePositions(cardPlayer2PossiblePositions);
  
      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos del juego.", error);
    }
  }

export function setHandCardsPlayer(cards, setHandCardsFunction) {
  const handCardImages = cards.map((card) => {
    const module = importGameCard(card.color, card.exit, card.initiative);
    return module.then((mod) => ({ ...card, image: mod.default }));
  });

  Promise.all(handCardImages).then((images) => {
    setHandCardsFunction(images);
  });
}

export function importGameCard(color, exit, initiative) {
  let name = "";
  let exitSubstring = exit.replace("EXIT_", "").substring(0, 3);
  if (exit === "START") {
    name = "C" + color.toUpperCase()[0] + "_START";
  } else {
    if (exitSubstring === "111") {
      name = "C" + color.toUpperCase()[0] + "_111_" + initiative;
    } else {
      name = "C" + color.toUpperCase()[0] + "_" + exitSubstring;
    }
  }
  return import(`../../static/images/GameCards/${name}.png`);
}

function importEnergyCard(color) {
  return import(`../../static/images/GameCards/C${color.toUpperCase()[0]}_ENERGY.png`);
}

export function importEnergyCards(color1, color2, setEnergyCards) {
  importEnergyCard(color1).then((module) => {
    const energyCard1 = { image: module.default };
    importEnergyCard(color2).then((module) => {
      const energyCard2 = { image: module.default };
      setEnergyCards([energyCard1, energyCard2]);
    });
  });
}

export function isPlayerAuthorized(user, dataGamePlayer) {
  return (
    user.id === dataGamePlayer[0].player.id ||
    user.id === dataGamePlayer[1].player.id
  );
}

export function getRotationStyle(energy) {
  switch (energy) {
    case 3:
      return { transform: 'rotate(0deg)' };
    case 2:
      return { transform: 'rotate(90deg)' };
    case 1:
      return { transform: 'rotate(180deg)' };
    case 0:
      return { transform: 'rotate(270deg)' };
    default:
      return {};
  }
}
