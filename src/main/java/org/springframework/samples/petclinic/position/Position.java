package org.springframework.samples.petclinic.position;



import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class Position{
    @Id 
    private int id;

    Integer row;
    Integer colum;
    
}
