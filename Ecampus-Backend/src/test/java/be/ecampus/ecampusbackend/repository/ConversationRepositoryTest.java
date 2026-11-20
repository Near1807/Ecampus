package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Conversation;
import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.repository.ConversationRepository;
import be.ecampus.ecampusbackend.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ConversationRepositoryTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void savesAndReadsBackAConversation() {
        // Arrange
        User user = new User("Ada", "Lovelace", "ada@example.com", "hash");
        UUID userId = userRepository.saveAndFlush(user).getId();
        User admin = new User("Grace", "Hopper", "grace@example.com", "hash");
        UUID adminId = userRepository.saveAndFlush(admin).getId();
        Conversation conversation = new Conversation(userId, adminId);

        // Act
        Conversation saved = conversationRepository.saveAndFlush(conversation);
        UUID id = saved.getId();
        entityManager.clear();
        Conversation found = conversationRepository.findById(id).get();

        // Assert
        assertEquals(userId, found.getUserId());
        assertEquals(adminId, found.getAdminId());
        assertNotNull(found.getCreatedAt());
    }

    @Test
    void rejectsAConversationWithTheSameUserAndAdmin() {
        // Arrange
        User user = new User("Ada", "Lovelace", "ada@example.com", "hash");
        UUID userId = userRepository.saveAndFlush(user).getId();
        Conversation conversation = new Conversation(userId, userId);

        // Act
        String errorMessage = "";
        try {
            conversationRepository.saveAndFlush(conversation);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("chk_conversations_distinct_participants"));
    }

    @Test
    void rejectsAConversationWithAnUnknownUser() {
        // Arrange
        User admin = new User("Grace", "Hopper", "grace@example.com", "hash");
        UUID adminId = userRepository.saveAndFlush(admin).getId();
        Conversation conversation = new Conversation(UUID.randomUUID(), adminId);

        // Act
        String errorMessage = "";
        try {
            conversationRepository.saveAndFlush(conversation);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("fk_conversations_user"));
    }
}