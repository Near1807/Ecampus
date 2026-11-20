package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Annonce;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AnnonceRepository extends JpaRepository<Annonce, UUID> {
}