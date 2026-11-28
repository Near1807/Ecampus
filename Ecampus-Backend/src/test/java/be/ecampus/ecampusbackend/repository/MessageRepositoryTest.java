package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Conversation;
import be.ecampus.ecampusbackend.model.Message;
import be.ecampus.ecampusbackend.model.User;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class MessageRepositoryTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void savesAndReadsBackAMessage() {
        User user = UserTestFactory.createUser(
                "Ada", "Lovelace", "ada@example.com");

        User admin = UserTestFactory.createUser(
                "Grace", "Hopper", "grace@example.com");

        UUID userId = userRepository.saveAndFlush(user).getId();
        UUID adminId = userRepository.saveAndFlush(admin).getId();

        Conversation conversation = new Conversation(userId, adminId);

        UUID conversationId =
                conversationRepository.saveAndFlush(conversation).getId();

        Message message = new Message(conversationId, userId, "Hello");

        Message saved = messageRepository.saveAndFlush(message);
        UUID id = saved.getId();

        entityManager.clear();

        Message found = messageRepository.findById(id).orElseThrow();

        assertEquals(conversationId, found.getConversationId());
        assertEquals(userId, found.getAuteurId());
        assertEquals("Hello", found.getContent());
        assertNotNull(found.getCreatedAt());
        assertNull(found.getReadAt());
    }

    @Test
    void rejectsAMessageWithAnUnknownConversation() {
        User user = UserTestFactory.createUser(
                "Ada", "Lovelace", "ada@example.com");

        UUID userId = userRepository.saveAndFlush(user).getId();

        Message message = new Message(
                UUID.randomUUID(), userId, "Hello");

        String errorMessage = "";

        try {
            messageRepository.saveAndFlush(message);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        assertNotNull(errorMessage);
        assertTrue(errorMessage.contains("fk_messages_conversations"));
    }

    @Test
    void rejectsAReadDateBeforeCreation() {
        User user = UserTestFactory.createUser(
                "Ada", "Lovelace", "ada@example.com");

        User admin = UserTestFactory.createUser(
                "Grace", "Hopper", "grace@example.com");

        UUID userId = userRepository.saveAndFlush(user).getId();
        UUID adminId = userRepository.saveAndFlush(admin).getId();

        Conversation conversation = new Conversation(userId, adminId);

        UUID conversationId =
                conversationRepository.saveAndFlush(conversation).getId();

        Message message = new Message(conversationId, userId, "Hello");

        message.setReadAt(Instant.now().minusSeconds(3600));

        String errorMessage = "";

        try {
            messageRepository.saveAndFlush(message);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        assertNotNull(errorMessage);
        assertTrue(errorMessage.contains("chk_messages_dates"));
    }

    @Test
    void findsMessagesByConversationIdOrderedByCreatedAtAsc() {
        User user = new User();
        user.setFirstname("Ada");
        user.setLastname("Lovelace");
        user.setMail("ada@example.com");
        user.setPasswordHash("hash");
        UUID userId = userRepository.saveAndFlush(user).getId();

        User admin = new User();
        admin.setFirstname("Grace");
        admin.setLastname("Hopper");
        admin.setMail("grace@example.com");
        admin.setPasswordHash("hash");
        UUID adminId = userRepository.saveAndFlush(admin).getId();

        UUID conversationId = conversationRepository
                .saveAndFlush(new Conversation(userId, adminId))
                .getId();

        messageRepository.saveAndFlush(new Message(conversationId, adminId, "Premier message"));
        messageRepository.saveAndFlush(new Message(conversationId, userId, "Deuxième message"));
        entityManager.clear();

        var messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);

        assertEquals(2, messages.size());
        assertEquals("Premier message", messages.get(0).getContent());
        assertEquals("Deuxième message", messages.get(1).getContent());
    }
}
