package us.l4_4.dp1.end_of_line.card;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/v1/cards")
@Tag(name= "Cards", description = "API for the management of Cards")
@SecurityRequirement(name = "bearerAuth")
public class CardController {

    private CardService cardService;

    @Autowired 
    public CardController(CardService cardService){
        this.cardService = cardService;
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Card findById(@PathVariable Integer id){
        return cardService.findById(id);
    }
    
    @GetMapping("/game/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Card> findCardsByGameId(@PathVariable Integer id){
        return cardService.findAllCardsOfGame(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Card update(@PathVariable Integer id, @RequestBody @Valid CardDTO cardDTO ){
        return cardService.update(id, cardDTO);
    }
}
