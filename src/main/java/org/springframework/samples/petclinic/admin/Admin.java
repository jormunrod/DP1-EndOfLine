package org.springframework.samples.petclinic.admin;



import org.springframework.samples.petclinic.model.User;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Admin extends User{
    
}
