package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Connexion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConnexionRepository extends JpaRepository<Connexion, UUID> {
}
