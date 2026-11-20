package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
}
