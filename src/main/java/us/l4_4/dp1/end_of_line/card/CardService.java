package us.l4_4.dp1.end_of_line.card;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.Valid;
import us.l4_4.dp1.end_of_line.enums.CardStatus;
import us.l4_4.dp1.end_of_line.enums.Color;
import us.l4_4.dp1.end_of_line.enums.Orientation;
import us.l4_4.dp1.end_of_line.exceptions.ResourceNotFoundException;
import us.l4_4.dp1.end_of_line.game.GameService;
import us.l4_4.dp1.end_of_line.gameplayer.GamePlayer;

@Service
public class CardService {
    
    CardRepository cardRepository;
    GameService gameService;

    @Autowired
    public CardService(CardRepository cardRepository, GameService gameService ){
        this.cardRepository = cardRepository;
        this.gameService = gameService;
    }

    /* @Transactional(readOnly = true)
    public List<Card> findAllCardsByColor(String color) throws DataAccessException{
        return cardRepository.findAllCardsByColor(Color.valueOf(color));
    } */

    @Transactional(readOnly = true)
    public Card findById(Integer id) throws DataAccessException{
        return this.cardRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Card", "id", id));
    }

    /* @Transactional(readOnly = true)
    public Iterable<Card> findAll() throws DataAccessException{
        return cardRepository.findAll();
    } */

    @Transactional
    public void delete(Integer id) throws DataAccessException{
        cardRepository.deleteById(id);
    }

    @Transactional
    public Card save(@Valid Card card ) throws DataAccessException{
        return cardRepository.save(card);
    }

    @Transactional(readOnly = true)
    public List<Card> findAllCardsOfGame(Integer id) throws DataAccessException{
        List<GamePlayer> gamePlayers = gameService.findById(id).getGamePlayers();
        Integer gamePlayerId1 = gamePlayers.get(0).getId();
        Integer gamePlayerId2 = gamePlayers.get(1).getId();
        List<Card> cards = cardRepository.findAllCardsByGamePlayer(gamePlayerId1);
        cards.addAll(cardRepository.findAllCardsByGamePlayer(gamePlayerId2));
        if(cards.isEmpty() || cards == null)
            throw new ResourceNotFoundException("Card", "game_id", id);
        return cards;
    }

    @Transactional
    public Card updateInHandCard(Integer cardId,Integer row, Integer column,  Orientation orientation){
        Card card = cardRepository.findById(cardId).get();
        card.setColumn(column);
        card.setRow(row);
        card.setOrientation(orientation);
        card.setCardState(CardStatus.ON_BOARD);
        card.setUpdatedAt(Date.from(java.time.Instant.now()));
        return cardRepository.save(card);
    }


}
