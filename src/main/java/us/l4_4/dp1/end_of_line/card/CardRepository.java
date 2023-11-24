package us.l4_4.dp1.end_of_line.card;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

@Repository
public interface CardRepository extends CrudRepository<Card, Integer>{

        @Query("SELECT c FROM Card c WHERE c.color = ?1")
        List<Card> findCardsByColor(String color);
    
}
