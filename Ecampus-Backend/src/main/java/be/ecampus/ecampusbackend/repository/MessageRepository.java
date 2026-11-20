package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
}
