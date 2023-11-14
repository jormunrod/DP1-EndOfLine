package us.l4_4.dp1.end_of_line.game;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {

    @Autowired
    GameService gameService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Game creatGame(@RequestBody @Valid Game game) {
        gameService.save(game);
        return game;
    }

    @GetMapping("/player/{playerId}")
    public List<Game> getGamesByPlayerId(@PathVariable Integer playerId) {
        return gameService.findGamesByPlayerId(playerId);
    }

    @GetMapping("/admin")
    public List<Game> getGames() {
        return gameService.getAllGames();
    }
    
}
