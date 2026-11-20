package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ImageRepository extends JpaRepository<Image, UUID> {
}

