package us.l4_4.dp1.end_of_line.game;


import static org.junit.jupiter.api.Assertions.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;


import us.l4_4.dp1.end_of_line.card.Card;
import us.l4_4.dp1.end_of_line.card.CardDTO;
import us.l4_4.dp1.end_of_line.card.CardService;
import us.l4_4.dp1.end_of_line.enums.CardStatus;
import us.l4_4.dp1.end_of_line.enums.Color;
import us.l4_4.dp1.end_of_line.enums.Exit;
import us.l4_4.dp1.end_of_line.enums.Hability;
import us.l4_4.dp1.end_of_line.enums.Orientation;
import us.l4_4.dp1.end_of_line.exceptions.ResourceNotFoundException;
import us.l4_4.dp1.end_of_line.gameplayer.GamePlayer;
import us.l4_4.dp1.end_of_line.gameplayer.GamePlayerService;

@SpringBootTest
@AutoConfigureTestDatabase
class GameServiceTests {

    @Autowired
    private GameService gameService;
    @Autowired
    private GamePlayerService gpService;
    @Autowired
    private CardService cardService;
    private Game game;
    private ChangeEffectRequest changeEffectRequest ;

    @Test
    public void shouldFindAllGames() {
        Iterable<Game> allGames = this.gameService.findAllGames();
        long count = StreamSupport.stream(allGames.spliterator(), false).count();
        assertNotEquals(0, count);
    }

    @Test 
    void shouldFindGameById(){
        Game game = gameService.findById(1);
        assertEquals(16, game.getRound());
        assertEquals(1, game.getId());
        assertEquals(6,game.getWinner().getId());
    }
    @Test
    void shouldNotFindGameById(){
        assertThrows(ResourceNotFoundException.class, () -> gameService.findById(100000));
    }


    @Test
    public void shouldCreateNewGame() {
        game = gameService.createNewGame(3,5,Color.RED,Color.BLUE);
        GamePlayer gp1 = game.getGamePlayers().get(0);
        GamePlayer gp2 = game.getGamePlayers().get(1);
        Integer nGamePlayers = game.getGamePlayers().size();
        assertNotEquals(null, game);
        assertNotEquals(null, game.getStartedAt());
        assertEquals(1, game.getRound());
        assertEquals(null, game.getWinner());
        assertEquals(null, game.getEndedAt());
        assertEquals(Hability.NONE, game.getEffect());
        assertEquals(2, nGamePlayers);
        assertEquals(25, gp1.getCards().size());
        assertEquals(25, gp2.getCards().size());
        
        assertEquals(Color.RED, gp1.getColor());
        assertEquals(3, gp1.getEnergy());
        assertEquals(3, gp1.getPlayer().getId());

        assertEquals(Color.BLUE, gp2.getColor());
        assertEquals(3, gp2.getEnergy());
        assertEquals(5, gp2.getPlayer().getId());
        
        for(Card card : gp1.getCards()){
            if(!card.getExit().equals(Exit.START)){
            assertEquals(Color.RED,card.getColor() );
            assertEquals(null, card.getRow());
            assertEquals(null, card.getColumn());
            assertEquals(Orientation.S, card.getOrientation());
            assertEquals(null, card.getIsTemplate());
            assertEquals(null, card.getUpdatedAt());
            }else {
                assertEquals(4, card.getRow());
                assertEquals(2, card.getColumn());
            }
        }
        for(Card card : gp2.getCards()){
            if(!card.getExit().equals(Exit.START)){
            assertEquals(Color.BLUE,card.getColor() );
            assertEquals(null, card.getRow());
            assertEquals(null, card.getColumn());
            assertEquals(Orientation.S, card.getOrientation());
            assertEquals(null, card.getIsTemplate());
            assertEquals(null, card.getUpdatedAt());
            }else{

                assertEquals(4, card.getRow());
                assertEquals(4, card.getColumn());
            }
        }
    }
    @Test
    void shouldCheckIfOnePlayerCanPlayAnotherGame(){
        Boolean canPlay2 = gameService.checkOnlyOneGameForEachPlayer(5);
        assertEquals(true, canPlay2);
    }

@Test
void shouldCheckThatGiveFiveRamdomCardsToAGamePlayerGiven(){
    Game game = gameService.createNewGame(11,12,Color.RED,Color.BLUE);
    GamePlayer gp1 = game.getGamePlayers().get(0);
    List<Card> player1Cards = gp1.getCards().stream()
    .filter(card -> card.getCardState() == CardStatus.IN_HAND)
    .collect(Collectors.toList());
    assertEquals(5, player1Cards.size());
}

@Test
void shouldFindNotEndedGamesByPlayerId(){
    List<Game> games = gameService.findNotEndedGamesByPlayerId(7);
    assertEquals(1, games.size());

}
@Test 
void shouldNotFindNotEndedGamesByPlayerId(){
    List<Game> games = gameService.findNotEndedGamesByPlayerId(1);
    assertEquals(0, games.size());
}


@Test
void shouldFindAllGamesByPlayerId(){
    List<Game> games = gameService.findAllGamesByPlayerId(7);
    assertEquals(true, games.size()>3);}



@Test
void shouldUpdateGameEffect(){

    changeEffectRequest = new ChangeEffectRequest();
    changeEffectRequest.setEffect("REVERSE");
    Game game = gameService.findById(17);
    game.setRound(9);
    gameService.save(game);
    Game g = gameService.updateGameEffect(17,changeEffectRequest);
    assertEquals(Hability.REVERSE, g.getEffect());

}
@Test
void shouldExtraGas(){
    Game game = gameService.createNewGame(9,10,Color.RED,Color.BLUE);
    GamePlayer gp1 = game.getGamePlayers().get(0);
    List<Card> player1Cards = gp1.getCards().stream()
    .filter(card -> card.getCardState() == CardStatus.IN_HAND)
    .collect(Collectors.toList());
    assertEquals(5, player1Cards.size());
    Card c = gameService.extraGasEffect(game.getId());
    assertEquals(CardStatus.IN_HAND,c.getCardState());
}
@Test
void shouldChangeCardsInHand(){ 
    Game game = gameService.createNewGame(4,6,Color.RED,Color.BLUE);
    GamePlayer gp1 = game.getGamePlayers().get(0);
    List<Card> player1Cards = gp1.getCards().stream()
    .filter(card -> card.getCardState() == CardStatus.IN_HAND)
    .collect(Collectors.toList());
    assertEquals(5, player1Cards.size());
    List<Card> cartas = gameService.changeCardsInHand(game.getId());   
    assertEquals(5, cartas.size());
    assertNotEquals(player1Cards, cartas);

}
@Test
void shouldUpdateGameTurn(){
    Game game = gameService.createNewGame(17,16,Color.RED,Color.BLUE);
    assertEquals(1, game.getRound());
    Game updatedGame = gameService.updateGameTurn(game.getId());
    assertEquals(2, updatedGame.getRound());
    assertNotEquals(game.getGamePlayerTurnId(),updatedGame.getGamePlayerTurnId());
    assertEquals(Hability.NONE, updatedGame.getEffect());
    GamePlayer gp1 = game.getGamePlayers().get(0);
    List<Card> player1Cards = gp1.getCards().stream()
    .filter(card -> card.getCardState() == CardStatus.IN_HAND)
    .collect(Collectors.toList());
    assertEquals(5, player1Cards.size());
}
}

