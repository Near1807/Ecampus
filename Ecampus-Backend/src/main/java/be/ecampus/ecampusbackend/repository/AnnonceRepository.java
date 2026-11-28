package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Annonce;
import be.ecampus.ecampusbackend.model.ValidationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AnnonceRepository extends JpaRepository<Annonce, UUID> {
    List<Annonce> findByValidationStatus(ValidationStatus validationStatus);
}
