package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Conversation;
import be.ecampus.ecampusbackend.model.User;
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
        User user = UserTestFactory.createUser(
                "Ada", "Lovelace", "ada@example.com");

        User admin = UserTestFactory.createUser(
                "Grace", "Hopper", "grace@example.com");

        UUID userId = userRepository.saveAndFlush(user).getId();
        UUID adminId = userRepository.saveAndFlush(admin).getId();

        Conversation conversation = new Conversation(userId, adminId);

        Conversation saved = conversationRepository.saveAndFlush(conversation);
        UUID id = saved.getId();

        entityManager.clear();

        Conversation found = conversationRepository.findById(id).orElseThrow();

        assertEquals(userId, found.getUserId());
        assertEquals(adminId, found.getAdminId());
        assertNotNull(found.getCreatedAt());
    }

    @Test
    void rejectsAConversationWithTheSameUserAndAdmin() {
        User user = UserTestFactory.createUser(
                "Ada", "Lovelace", "ada@example.com");

        UUID userId = userRepository.saveAndFlush(user).getId();
        Conversation conversation = new Conversation(userId, userId);

        String errorMessage = "";

        try {
            conversationRepository.saveAndFlush(conversation);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        assertNotNull(errorMessage);
        assertTrue(errorMessage.contains(
                "chk_conversations_distinct_participants"));
    }

    @Test
    void rejectsAConversationWithAnUnknownUser() {
        User admin = UserTestFactory.createUser(
                "Grace", "Hopper", "grace@example.com");

        UUID adminId = userRepository.saveAndFlush(admin).getId();

        Conversation conversation =
                new Conversation(UUID.randomUUID(), adminId);

        String errorMessage = "";

        try {
            conversationRepository.saveAndFlush(conversation);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        assertNotNull(errorMessage);
        assertTrue(errorMessage.contains("fk_conversations_user"));
    }

    @Test
    void findsAConversationByUserIdAndAdminId() {
        User user = UserTestFactory.createUser(
                "Ada", "Lovelace", "ada@example.com");
        User admin = UserTestFactory.createUser(
                "Grace", "Hopper", "grace@example.com");

        UUID userId = userRepository.saveAndFlush(user).getId();
        UUID adminId = userRepository.saveAndFlush(admin).getId();

        Conversation saved = conversationRepository.saveAndFlush(new Conversation(userId, adminId));
        entityManager.clear();

        var found = conversationRepository.findByUserIdAndAdminId(userId, adminId);

        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
    }
}