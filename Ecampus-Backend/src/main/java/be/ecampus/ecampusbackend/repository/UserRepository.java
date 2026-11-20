package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.User;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** Data access for {@link User}. */
public interface UserRepository extends JpaRepository<User, UUID> {

    User findByMailIgnoreCase(String mail);
    
}