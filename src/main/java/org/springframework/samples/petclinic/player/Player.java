package org.springframework.samples.petclinic.player;


import java.util.Set;

import org.hibernate.validator.constraints.URL;
import org.springframework.samples.petclinic.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "players")
public class Player extends User{
    
    @NotBlank
    @Column(unique = true)
    @Size(min = 5, max = 15)
    String nickname;

    @NotBlank
    @URL
    String avatar;

    @NotNull
    Set<Integer> friends; 
    
    //@NotNull
    //@OneToMany(mappedBy = "player")
    //Set<GamePlayer> gamePlayers;
    

    

}
