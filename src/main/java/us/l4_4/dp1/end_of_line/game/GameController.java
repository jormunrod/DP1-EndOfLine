package us.l4_4.dp1.end_of_line.game;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import us.l4_4.dp1.end_of_line.card.Card;
import us.l4_4.dp1.end_of_line.enums.Color;

@RestController
@RequestMapping("/api/v1/games")
@Tag(name = "Games", description = "API for the management of Games")
public class GameController {

    @Autowired
    GameService gameService;

    @GetMapping("/players/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Game> findAllGamesByPlayerId(@PathVariable Integer id) {
        return gameService.findAllGamesByPlayerId(id);
    }

    @GetMapping("/players/{id}/notended")
    @ResponseStatus(HttpStatus.OK)
    public List<Game> findNotEndedGamesByPlayerId(@PathVariable Integer id) {
        return gameService.findNotEndedGamesByPlayerId(id);
    }

    @GetMapping("/all")
    public Iterable<Game> findAllGames() {
        return gameService.findAllGames();
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public Game create(@RequestBody @Valid NewGameRequest newGameRequest) {
        Integer player1_id = newGameRequest.getPlayer1Id();
        Integer player2_id = newGameRequest.getPlayer2Id();
        Color player1_color_enum = Color.valueOf(newGameRequest.getPlayer1Color());
        Color player2_color_enum = Color.valueOf(newGameRequest.getPlayer2Color());
        return gameService.createNewGame(player1_id, player2_id, player1_color_enum, player2_color_enum);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Game findById(@PathVariable Integer id) {
        return gameService.findById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Game update(@PathVariable Integer id, @RequestBody @Valid GameDTO gameDTO) {
        return gameService.updateGame(id, gameDTO);
    }

    @GetMapping("/fivecards/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Card> findFiveCards(@PathVariable Integer id) {
        return gameService.findFiveRandomCards(id);
    }

}
