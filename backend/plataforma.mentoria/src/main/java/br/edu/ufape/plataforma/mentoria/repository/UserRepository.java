package br.edu.ufape.plataforma.mentoria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import br.edu.ufape.plataforma.mentoria.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{

    User findByEmail(String email);
    
}

