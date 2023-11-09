package org.springframework.samples.petclinic.game;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    
}